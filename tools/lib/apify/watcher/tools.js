import {Script} from 'vm';

import {Comms} from 'cyber-comms';
import {Error} from 'cyber-error';
import dot from 'dot-object';

import {isObject} from '../../basic.js';

export const parsers = {
	/**
	 *
	 * @param {string} string
	 */
	filters: string => {
		const script = new Script(string);
		const parsed = script.runInThisContext();
		const result = Array.isArray(parsed) ? parsed : [parsed];

		return result.filter(filter => typeof filter === 'function');
	},

	/**
	 *
	 * @param {types.actorInput} input
	 */
	scrapers: input => {
		const script = new Script(input.scrapers || '');
		const parsed = script.runInThisContext();

		if (typeof parsed === 'function')
			return parsed(input);
	},
};

/**
 *
 * @param {types.actorInput} input
 * @returns {types.input}
 */
export const Input = input => ({
	...input,
	filters: Array.isArray(input.filters) ? input.filters : parsers.filters(input.filters),
});

/**
 *
 * @param {Dataset} dataset
 * @returns
 */
export const getDatasetRecords = async dataset => {
	const data = await dataset.getData();

	return data.items;
};

/**
 *
 * @param {Array<Object>} records
 * @param {Array<Object>} _records
 * @returns {(result: Object) => Object | undefined}
 */
export const recordMatcher = (records, _records) => _result => records[_records.findLastIndex(_record => JSON.stringify(_result) === JSON.stringify(_record))];

/**
 *
 * @param {Array<Object>} records
 * @returns {(result: Object) => Boolean}
 */
export const excludeMatches = records => result => !records.some(record => JSON.stringify(result) === JSON.stringify(record));
// export const excludeRecords = records => result => !records.some(record => {
// 	const values = {
// 		record: Object.values(record),
// 		result: Object.values(result),
// 	};

// 	return values.record.every((field, index) => field === values.result[index]);
// });

/**
 *
 * @param {{filter: Function, update: Object, record?: Object | undefined}} param0
 */
const filterApplier = ({filter, update, record}) => {
	const ignoreFilter = filter.length > 1 && !record;
	if (ignoreFilter) return true;

	try {
		const result = filter(update, record || {});
		console.log({filter: filter.toString(), record, update, result: result && update});

		return result;
	} catch (error) {
		console.error(new Error({
			// @ts-ignore
			error,
			data: {filter},
			message: `Failed to evaluate filter: ${filter?.toString?.() || filter}`,
		}));

		throw error;
	}
};

/**
 *
 * @param {Array<Function>} filters
 * @returns {(params: {filter: Function, update: Object, record: Object}) => Object | undefined}
 */
const applyFilters = filters => update => !!filters.every(filter => filterApplier({filter, update}));

const iterateFilters = {
	/**
	 *
	 * @param {Array<Function>} filters
	 * @returns {(update: Object) => Boolean}
	 */
	absolute: filters => update => !!filters.every(filter => filterApplier({filter, update})),

	/**
	 *
	 * @param {Array<Function>} filters
	 * @param {Function} matcher
	 * @param {Function} _matchRecord
	 * @returns {(update: Object) => Boolean}
	 */
	relative: (filters, matcher, _matchRecord) => update => !!filters.every(filter => filterApplier({filter, update, record: _matchRecord(matcher(update))})),

	/**
	 *
	 * @param {Array<Function>} filters
	 * @returns {(params: {filter: Function, update: Object, record: Object}) => Object | undefined}
	 */
	common: filters => params => !!filters.every(filter => filterApplier(params)),
};

/**
 *
 * @param {Array<string>} keywords
 * @returns {(update: Object) => Boolean}
 */
const keywordFilter = keywords => update => keywords.some(keyword => JSON.stringify(update).includes(keyword));

/**
 *
 * @param {Array<Function>} filters
 * @returns
 */
const divideFilters = filters => ({
	absolute: filters.filter(filter => !(filter.length > 1)),
	relative: filters.filter(filter => filter.length > 1),
});

const processFilters = {
	/**
	 *
	 * @param {_Watcher.filters} filters
	 * @returns {(update: Object) => Boolean}
	 */
	absolute: filters => update => !!filters.every(filter => filterApplier({filter, update})),
	relative: filters => (matcher, updateMatcher) => update => !!filters.every(filter => filterApplier({filter, update, record: updateMatcher(matcher(update))})),
};

/**
 *
 * @param {{absolute: Array<Function> | undefined, relative: Array<Function> | undefined}} filters
 * @param {Function} matcher
 * @param {Array<Object>} records
 * @returns
 */
const createFilter = (filters, matcher, records) => filters.relative?.length ?

	/**
	 *
	 * @param {Object} update
	 * @returns
	 */
	update => processFilters.absolute(filters.absolute)(update) && processFilters.relative(filters.relative)(matcher, recordMatcher(records, records.map(record => matcher(record))))(update) :

	/**
	 *
	 * @param {Object} update
	 * @returns
	 */
	update => processFilters.absolute(filters.absolute)(update);

/**
 *
 * @param {{records: Array<Object>, updates: Array<Object>, filters: Array<Function>, keywords: Array<string>, matcher?: Function}} param0
 */
export const filterUpdates = ({records, updates, filters, matcher, keywords}) => {
	const filter = (filters?.length && createFilter(divideFilters(filters), matcher, records)) || (keywords?.length && keywordFilter(keywords));

	// updates.reduce((result, update) => [...result, [update, recordMatcher(records, records.map(record => matcher(record)))]], []);
	return filter ?
		updates.filter(filter) :
		updates;
};

/**
 *
 * @param {Array<Function>} decorators
 * @returns {(output: Object) => Object}
 */
export const extendOutput = decorators => output => decorators.reduce((pool, next) => next(output), output);

/**
 *
 * @param {Array<Function> | undefined} decorators
 * @returns {(result: Object) => Object}
 */
export const getResult = decorators => result => decorators ? extendOutput(decorators)(dot.object(result)) : dot.object(result);

/**
 *
 * @param {Object} output
 * @returns {string}
 */
export const getMessage = output =>
	Object
		.entries(output)
		.flatMap(([key, value]) =>
			isObject(value) ?
				getMessage(value) :
				value)
		.join('\n');

/**
 *
 * @param {{items: Array<Object>, input: types.input, title: string}} param0
 */
export const notify = async ({input, items, title}) => {
	const maybeServices = [
		input.alerts.ntfy.enable && new Comms.services.Ntfy({
			channel: input.alerts.ntfy.channel,
		}),
		input.alerts.mail.enable && new Comms.services.Mail({
			recipients: [input.alerts.mail.address],
		}),
	];

	const services = maybeServices.filter(service => service);

	if (!services.length)
		console.warn('Alerts are enabled but none of the notification services are enabled. No service enabled to dispatch alerts.');

	const comms = new Comms(services);

	for (const item of items) {
		await comms
			.cast({
				message: item,
				channel: input.alerts.channel,
				options: {
					title,
				},
			});
	}
};

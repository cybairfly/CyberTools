import {Script} from 'vm';

import {Comms} from 'cyber-comms';
import {Error} from 'cyber-error';

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
 * @returns {(result: Object) => Boolean}
 */
export const excludeRecords = records => result => !records.some(record => JSON.stringify(result) === JSON.stringify(record));
// export const excludeRecords = records => result => !records.some(record => {
// 	const values = {
// 		record: Object.values(record),
// 		result: Object.values(result),
// 	};

// 	return values.record.every((field, index) => field === values.result[index]);
// });

/**
 *
 * @param {{filter: Function, update: Object}} param0
 */
const catchFilter = ({filter, update}) => {
	try {
		return filter(update);
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
 * @returns {(update: Object) => Boolean}
 */
const iterateFilters = filters => update => !!filters.every(filter => catchFilter({filter, update}));

/**
 *
 * @param {Array<string>} keywords
 * @returns {(update: Object) => Boolean}
 */
const keywordFilter = keywords => update => keywords.some(keyword => JSON.stringify(update).includes(keyword));

/**
 *
 * @param {{updates: Array<Object>, filters: Array<Function>, keywords: Array<string>}} param0
 */
export const filterUpdates = ({updates, filters, keywords}) => {
	const filter = (filters?.length && iterateFilters(filters)) || (keywords?.length && keywordFilter(keywords));

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

import {Logue} from 'cyber-logue';
import {tools} from 'cyber-tools';

import {
	Input,
	excludeRecords,
	filterUpdates,
	getDatasetRecords,
	getMessage,
	getResult,
	notify,
} from './tools.js';

const {sleep} = tools;

export class Watcher {
	#log = new Logue().child({prefix: this.constructor.name});

	#records;

	/**
	 *
	 * @param {{input: _Watcher.input, datasets: _Watcher.datasets, decorators?: Array<Function>}} param
	 */
	constructor({input, datasets, decorators}) {
		this.state = {
			input: Input(input),
			datasets,
			decorators,
		};
	}

	/**
	 * Checks results against records stored previously. Returns a summary with updates.
	 * @param {Array<Object>} results results to check and compare with previous records
	 * @param {Object} [page] page to extract header/title
	 * @returns {Promise<{records: Array<object>, updates: Array<object>, outputs: Array<object>}>}
	 */
	check = async (results, page) => {
		const {
			records,
			updates,
			outputs,
		} = await this.#probe(results);

		if (updates.length)
			await this.#store(updates, outputs);

		if (outputs.length)
			await this.#alert(outputs, page);

		this.#print({records, updates, outputs});

		return {
			records,
			updates,
			outputs,
		};
	};

	/**
	 *
	 * @param {Array<Object>} results
	 */
	#probe = async (results, {input: {filters, keywords}, datasets, decorators} = this.state) => {
		const records = this.#records || await getDatasetRecords(datasets.records);
		const updates = results.map(getResult(decorators)).filter(excludeRecords(records));
		const outputs = filters || keywords ? filterUpdates({updates, filters, keywords}) : updates;

		this.#records = records;
		this.#records.push(...updates);

		return {
			records,
			updates,
			outputs,
		};
	};

	/**
	 *
	 * @param {Array<Object>} updates
	 * @param {Array<Object>} outputs
	 */
	#store = async (updates, outputs, {datasets} = this.state) => {
		await datasets.records.pushData(updates);

		if (datasets.default && outputs.length)
			await datasets.default.pushData(outputs);
	};

	/**
	 *
	 * @param {Array<Object>} outputs
	 */
	#alert = async (outputs, page, {input, datasets} = this.state) => {
		const title = page ? await page.title() : 'Watcher Updates';
		if (!input.alerts.enable)
			this.#log.warning('Alerts are disabled in options. Notifications will not be dispatched.');
		else {
			await notify({
				// items: outputs.map(output => process.env.isPremium ? getMessage(output) : insertPromo(getMessage(output))),
				items: outputs.slice(0, input.alerts.limit).map(getMessage),
				input,
				title,
			});
		}
	};

	/**
	 *
	 * @param {{records: Array<Object>, updates: Array<Object>, outputs: Array<Object>}} param0
	 */
	#print = ({
		records,
		updates,
		outputs,
	}, {input: {filters, keywords}} = this.state) => {
		this.#log.info({
			records: records.length,
			updates: updates.length,
			outputs: outputs.length,
		});

		if (outputs.length || filters?.length || keywords?.length) {
			// this.#log.info(`Updates without filters: (${updates.length})`);
			this.#log.info('Updates matching filters:', {outputs});
		}
	};

	/**
	 *
	 * @param {{crawler: _Watcher.crawler, request: _Watcher.request}} param0
	 */
	cycle = async ({crawler, request}, {input} = this.state) => {
		console.log(`Next cycle in ${input.delay} seconds.`);
		await sleep((input.delay || 300) * 1000);
		await crawler.addRequests([{
			url: request.url,
			uniqueKey: Date.now().toString(),
		}]);
	};
}

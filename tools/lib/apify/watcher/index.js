import {Logue} from 'cyber-logue';
import dot from 'dot-object';

import {
	excludeRecords,
	filterUpdates,
	getMessage,
	notify,
} from './tools.js';
import {sleep} from '../../basic.js';

export class Watcher {
	/** @type {types.page | undefined} */
	#page;

	/**
	 *
	 * @param {types.state} state
	 */
	constructor({input, datasets, records}) {
		this.state = {input, datasets, records};
		this.log = new Logue().child({prefix: this.name});
	}

	get page() {
		return this.#page;
	}

	set page(page) {
		this.#page = page;
	}

	/**
	 *
	 * @param {Array<Object>} results
	 */
	probe = async (results, {input, records} = this.state) => {
		const updates = results.map(result => dot.object(result)).filter(excludeRecords(records));
		const outputs = input.filters.length || input.keywords ? filterUpdates({updates, input}) : updates;

		if (outputs.length) {
			await this.store(outputs);
			await this.alert(outputs);
		}

		this.print({records, updates, outputs});

		return {
			records,
			updates,
			outputs,
		};
	};

	/**
	 *
	 * @param {Array<Object>} outputs
	 */
	store = async (outputs, {datasets} = this.state) => {
		// const outputsExtended = outputs.map(extendOutput([insertUrl(page.url())]));
		this.state.records.push(...outputs);
		await datasets.records.pushData(outputs);
		await datasets.default.pushData(outputs);
	};

	/**
	 *
	 * @param {Array<Object>} outputs
	 */
	alert = async (outputs, {input} = this.state) => {
		const title = this.page ? await this.page.title() : input.dataset;
		if (!input.alerts.enable)
			log.warning('Alerts are disabled in options. Notifications will not be dispatched.');
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
	print = ({
		records,
		updates,
		outputs,
	}) => {
		console.log({
			records: records.length,
			updates: updates.length,
			outputs: outputs.length,
		});

		if (outputs.length) {
			console.log(`Updates without filters: (${updates.length})`);
			console.log(`Updates matching filters: (${outputs.length})`, {outputs});
		}
	};

	/**
	 *
	 * @param {{crawler: types.crawler, request: types.request}} param0
	 */
	cycle = async ({crawler, request}, {input} = this.state) => {
		console.log(`Next cycle in ${input.watchDelay} seconds.`);
		await sleep((input.watchDelay || 300) * 1000);
		await crawler.addRequests([{
			url: request.url,
			uniqueKey: Date.now().toString(),
		}]);
	};
}

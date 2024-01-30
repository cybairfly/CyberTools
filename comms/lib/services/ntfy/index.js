// import {validate} from 'cyber-tools';
import got from 'got';

import {Service} from '../index.js';

export class Ntfy extends Service {
	/**
	 *
	 * @param {channel: null | string} param0
	 */
	constructor({channel = null}) {
		super();
		this.channel = channel;
	}

	dispatch = async request => {
		const response = await got(request);
	};

	validate = request => {
		// this.log.info('Validation:', request);
	};

	Message = ({message, channel, options: {title, priority, tags}}) => ({
		method: 'POST',
		url: `http://ntfy.sh/${this.channel || channel}`,
		headers: {
			title: title?.replace(/\W/g, '-'),
			tags,
			priority,
		},
		body: message,
	});
}

// import {validate} from 'cyber-tools';
import got from 'got';

import {Service} from '../index.js';

export class Ntfy extends Service {
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
			title,
			tags,
			priority,
		},
		body: message,
	});
}

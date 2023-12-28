// import {validate} from 'cyber-tools';
import got from 'got';

import {Service} from '../index.js';

export class Mock extends Service {
	dispatch = async request => {
		// console.log('Simulation:', request);
	};

	validate = request => {
		// this.log.info('Validation:', request);
	};

	Message = ({message, channel, options}) => ({
		message,
		channel,
		options,
	});
}

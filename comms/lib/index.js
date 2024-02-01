import {log} from './logger.js';
import {Mail} from './services/mail/index.js';
import {Mock} from './services/mock/index.js';
import {Ntfy} from './services/ntfy/index.js';

class Comms {
	#services;

	static services = {
		Mock,
		Mail,
		Ntfy,
	};

	/**
	 *
	 * @param {Array<Object>} services
	 */
	constructor(services = [Mock]) {
		this.log = log;
		this.#services = services.map(ServiceOrInstance => typeof ServiceOrInstance === 'function' ? new ServiceOrInstance(this.log) : ServiceOrInstance);
	}

	get services() {
		return this.#services;
	}

	send = async ({service, message, channel, options}) => service.send({message, channel, options});

	cast = async ({message, channel, options}) => Promise
		.all(this.services
			.map(service =>
				this.send({service, message, channel, options})));
}

const comms = new Comms();

export {
	comms,
	Comms,
};

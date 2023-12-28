import { log } from '../logger.js';

export class Service {
	constructor() {
		this.log = log.child({prefix: this.constructor.name});
	}

	send = async ({message, channel, options = {title: null, priority: null, tags: null}}) => {
		const request = this.Message({
			message: this.#normalize(message),
			channel,
			options,
		});

		this.validate(request);
		this.dispatch(request);
		this.log.info(request);
	};

	#throw() {
		throw Error(`Method not implemented in integration ${this.constructor.name}`);
	}

	#normalize = message => typeof message === 'string' ?
		message :
		message?.toString?.() || JSON.stringify(message);

	dispatch = message => {
		this.#throw();
	};

	validate = request => {
		this.#throw();
	};

	Message = () => {
		this.#throw();
	};
}

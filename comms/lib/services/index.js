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

		const actions = {
			validate: this.validate(request),
			dispatch: this.dispatch(request),
			log: this.log.info(request),
		};

		return actions.dispatch;
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

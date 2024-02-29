/* eslint-disable lines-between-class-members */
class CyberError extends global.Error {
	#data = null;
	#type = null;
	#cause = null;
	#retry = false;
	#props = null;

	static #model = {
		message: '',
		name: '',
		type: '',
		data: {},
		cause: {},
		retry: false,
	};

	/**
     * Custom error class with additional properties
     * Rethrow a wrapped error - Cyber.Error({error})
     * Rethrow as custom error - extend Cyber.Error
     *
     * Both cases support custom properties unless
     * overloaded by the child error outside its ctor
     *
     * Prefer using the pre-defined data property for
     * any extraneous properties besides the defined.
     *
     * Log to print custom error or stringify to send
     * all its extra properties outside of the robot.
     * @param {_Error.options} options
     */
	constructor(options = {}, modelExtras = null) {
		super(options.message);

		CyberError.#model = modelExtras ? {
			...CyberError.#model,
			...modelExtras,
		} : CyberError.#model;

		this.name = options.name;
		this.#type = options.type;
		this.#props = Object.keys(CyberError.#model);

		Object
			.entries({
				...options.error,
				...options,
			})
			.filter(([key]) => !this.#props
				.some(item => key === item))
			.forEach(([key, value]) => this[key] = value);

		if (CyberError.captureStackTrace)
			CyberError.captureStackTrace(this, this.constructor);

		if (options.error) {
			// TODO maybe elevate data
			// if (options.error.data)
			//     this.data = options.error.data;

			if (this.constructor.name !== 'CyberError')
				this.#cause = options.error;
			else {
				this.#cause = options.error.cause;
				this.name = options.name && options.error.name ?
					`${options.name} ◄ ${options.error.name}` :
					(options.name || options.error.name);

				this.message = options.message && options.error.message ?
					`${options.message} ◄ ${options.error.message.split('\n', 1)[0]}` :
					(options.message || options.error.message);

				if (options.stack)
					this.stack = options.error.stack;

				if (options.error.retry)
					this.#retry = options.error.retry;
			}
		}

		if (options.data)
			this.data = options.data;

		if (options.retry !== undefined)
			this.#retry = options.retry;

		this.name = this.name || this.#getName();
	}

	set data(data = {}) {
		if (typeof data !== 'object') return;
		this.#data = {...this.#data, ...data};
	} get data() {
		return this.#data || null;
	}

	set type(type) {
		this.#type = this.type || type;
	} get type() {
		return this.#type || this.constructor.name;
	}

	set cause(error) {
		this.#cause = this.#cause || error;
	} get cause() {
		return this.#cause || null;
	}

	set retry(retry) {
		this.#retry = this.#retry || retry;
	} get retry() {
		return this.#retry || false;
	}

	#getName = (chain = [], child = this.constructor) => {
		if (child.name === 'CyberError')
			return chain.length ? `Error.${chain.join('.')}` : 'Error';

		return this.#getName([child.name, ...chain], Object.getPrototypeOf(child));
	};

	toJSON() {
		const output = Object
			.fromEntries(this.#props
				.filter(key => this[key] || this[key] === false)
				.map(key => [key, this[key]]));

		if (this.cause) {
			output.cause = this.cause instanceof CyberError ?
				JSON.parse(JSON.stringify(this.cause)) :
				this.cause.toString();
		}

		return Reflect.ownKeys(output).length ? output : null;
	}
}

export {CyberError};

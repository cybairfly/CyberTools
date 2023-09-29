import { Log } from '@apify/log';

import { SpaceInput } from './input.js';
import { proxify } from './proxy.js';

const logger = new Log();

// class SecretSpace {
//     hide(input) {
//         return Object.entries(input).forEach(([key, value]) => this.#secrets[key] = value);
//     }

//     get show() {
//         return this.#secrets;
//     }
// }

class State {
	#options;

	#secrets;

	// static #options = {
	//     bypass: false,
	//     secret: false,
	// };

	// static symbols = {
	//     hide: Symbol.for('hide'),
	//     show: Symbol.for('show'),
	//     secret: Symbol.for('secret'),

	// }

	// static Secret = class Secret {}
	// static secret = Symbol.for('secret');

	static Input = SpaceInput;
	// static store = (space, input, options) => new Space.Input({ input, options });
	// static store = (space, input, options) => {
	//     if (!isObject(input)) {
	//         throw Error('Space.store input must be an object')
	//     }

	//     const spaceInput = new Space.Input({ input, options });
	//     Object.entries(input).forEach(([key, value]) => {
	//         space[key] = new Space.Input({ input: value, options });
	//     });

	//     spaceInput.input
	//     space[Symbol.for('space-store')]
	// }

	/**
     *
     * @param {{
        * rootMode?: boolean
        * syncMode?: boolean
     * }} options
     *
     * @param {object} options
     * @param {boolean} [options.rootMode] utilize the instance object directly instead of its private state property
     * @param {boolean} [options.syncMode]
     */
	constructor({ syncMode: strict = true } = {}) {
		this.#options = { syncMode: strict };

		const log = logger.child({ prefix: this.constructor.name });
		// Object.keys(this).forEach((key) => {
		//     this[ key ] = proxify({ log })(this[ key ]);
		// });

		// this.#secrets = proxify({ log, options: { root: true } })(this.#secrets);
		const spaceProxy = proxify({ log })(this);

		return spaceProxy;
	}

	// static get Secrets () {
	//     return this.#Secrets;
	// }

	[Symbol.for('secret')] = input => Object.entries(input).forEach(([key, value]) => this.#secrets[key] = value);

	set [Symbol.for('space-store')](input) {

	}

	// static get options() {
	//     return this.#options;
	// }

	get secrets() {
		return this.#secrets;
	}

	get [Symbol.for('secret')]() {
		return this.#secrets;
	}

	get _tools() {
		return new SecretSpace();
	}

	_hide(input) {
		return Object.entries(input).forEach(([key, value]) => this.#secrets[key] = value);
	}

	get _show() {
		return this.#secrets;
	}
}

export { State };
export default State;

import { recurseProxify } from "./tools.js";
import { Log } from '@apify/log';

const logger = new Log();

// class SecretSpace {
//     hide(input) {
//         return Object.entries(input).forEach(([key, value]) => this.#secrets[key] = value);
//     }

//     get show() {
//         return this.#secrets;
//     }
// }

class Space {
    #options;
    #secrets;

    static Secret = class Secret {}
    static secret = Symbol.for('secret');

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
        const spaceProxy = recurseProxify(this, { log, secrets: this._secrets });

        return spaceProxy;
    }

    // static get Secrets () {
    //     return this.#Secrets;
    // }

    [Symbol.for('secret')] = (input) => Object.entries(input).forEach(([key, value]) => this.#secrets[key] = value);

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

export { Space }
export default Space;

const space = new Space();
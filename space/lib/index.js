import { recurseProxify } from "./tools.js";
import { Log } from '@apify/log';

const logger = new Log();

class CyberSpace {
    #options;

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
        const spaceProxy = recurseProxify(this, log);
        return spaceProxy;
    }
}

export default CyberSpace;
export { CyberSpace }
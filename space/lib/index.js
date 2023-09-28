import { isObject, recurseProxify } from "./tools";

class Space {
    static state = Symbol.for('state');

    /**
     * @template {{}} State
     */
    #state;
    state = {};

    #options = {
        rootMode: true,
        syncMode: true
    };

    /**
     * 
     * @param {{
        * rootMode?: boolean
        * syncMode?: boolean
     * }} options - utilize the instance object directly instead of its private state property
     */
    constructor({ rootMode = true, syncMode = true } = {}) {
        this.#options = { rootMode, syncMode };

        const self = this;

        if (rootMode) {
            // const proxy = new Proxy(this, {
            //     get(target, prop, receiver) {
            //         if (target === self && prop === 'state') {
            //             console.log('Forward property access');
            //             const value = Reflect.get(target, prop, receiver);
            //             // const retval = Object.freeze(value);
            //             // console.log(retval);
            //             return {...value};
            //             // return Reflect.get(target, prop, receiver);
            //         }

            //         return Reflect.get(target, prop, receiver);
            //         // return prop === self[Symbol.for('state')] ? Reflect.get(self.constructor, prop, receiver) : Reflect.get(target, prop, receiver);
            //     },
            //     set(target, prop, value, receiver) {
            //         if (target === self && prop === 'store') {
            //             console.log('Forward property assignment');
            //             return Reflect.get(target, prop, receiver);
            //         }

            //         console.log('FORBIDDEN');
            //         return false;

            //         // return Reflect.set(target, prop, value, receiver);
            //     },
            //     apply(target, thisArg, args) {
            //         // Forward function calls to the original object
            //         return Reflect.apply(target, thisArg, args);
            //     }
            // });

            // Custom initialization logic for the original object
            // ...

            const spaceProxy = recurseProxify(this);

            return spaceProxy;
        }
    }


    /**
     * ==============
     * PUBLIC METHODS
     * ==============
     */

    /**
    * @param {Partial<Object>} input - state to store in space
    */
    store = (input) => {
        this.#check(input);
        this.#store = input;
    }

    merge = (input) => {
        this.#check(input);
        this.#store = this.#merge(this.#store, input);
    }


    /**
     * ================
     * UTILITY ACCESSOR
     * ================
     */

    get [Symbol.for('state')]() {
        return Object.freeze({ ...this.#state });
    }


    /**
     * ===============
     * PRIVATE MEMBERS
     * ===============
     */

    get #store() {
        return this.state;
        // return this.#options.rootMode ? { ...this } : { ...this.#state };
    }

    set #store(state = {}) {
        // this.#print({ states: { original: this.state, updated: state } });

        this.#options.rootMode ? this.#remap(state) : this.#apply(state);

        this.#print({ state: this.state });
    }


    /**
     * ===============
     * PRIVATE METHODS
     * ===============
     */

    #apply = (state = {}) => ({
        ...this.#store,
        ...state
    })

    #force = (state = {}) => ({
        ...this.#store,
        ...state
    })

    #remap = (state = {}) => {
        return Object.entries(state).forEach(([key, value]) => {
            if (this.#options.syncMode && !this.state[key]) {
                console.warn(`Model and state are out of sync. Missing key: [${key}]`);
            }

            this.state[key] = value;
        });
    }

    #check = (input) => {
        const isObject = input && !Array.isArray(input) && typeof input === 'object';
        if (!isObject)
            throw Error('Input must be an object');
    }

    #merge = (initial, override) => {
        if (!initial || !override)
            return initial ?? override ?? {};

        return Object.entries({ ...initial, ...override }).reduce(
            (acc, [key, value]) => {
                return {
                    ...acc,
                    [key]: (() => {
                        if (isObject(initial[key]))
                            return this.#merge(initial[key], value);
                        return value;
                    })()
                };
            },
            {}
        );
    };

    #print = ({ states }) => {
        if (states) {
            // console.log({ original });
            // console.log('→');
            console.log(updated);
            // console.log(`${original} → ${updated}`);
        }

        console.log(this.state);
        // this.#debug('state update', state);
        // this.#debug(JSON.stringify(state, null, 4));
    }

    // set force(state = {}) {
    //     this.#store = {
    //         ...this.#store,
    //         ...state,
    //     };

    //     // this.#debug('force state update', state);
    //     // this.#debug(JSON.stringify(state, null, 4));
    // }
}

export default Space;
export { Space }
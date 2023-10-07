import { diff } from 'deep-object-diff';
import Space from './index.js';

const isObject = (value) => {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
};

/** @param {{input: import('./input.js').SpaceInput} | any} */
const proxify = (input, { log, options }) => {
    if (!isObject(input))
        return input;

    // TODO need to proxify properties one by one, this break references to original inputs
    // const proxifyProperty = ([key, value]) => [key, recurseProxify(value, { log })];
    // const target = Object.fromEntries(Object.entries(input).map(proxifyProperty));

    const proxifyProperty = ({ log, options }) => ([key, value]) => [key, proxify(value, { log, options })];
    const root = Object.fromEntries(Object.entries(input).map(proxifyProperty({ log, options })));

    return new Proxy(root, {
        // get(target, prop, receiver) {
        //     const value = Reflect.get(target, prop, receiver);

        //     // if (value instanceof Space.Input) {
        //     //     const { content, options } = value;

        //     //     if (!isObject(content) || options.bypass)
        //     //         return content;

        //     //     if (options.secret) {
        //     //         return proxify(new Space.Input({ input: content, options }), { log });
        //     //     }
        //     // }

        //     return Reflect.get(target, prop, target);
        //     // return proxify(value, { log, options });
        // },
        set(target, property, value, receiver) {
            // if (target?.constructor?.name === Space.Secrets.name) {
            //     const result = Reflect.set(target, property, value, receiver);
            //     log.info(`[${property}] → <redacted>`);

            //     return result;
            // }

            if (!Object.keys(target).includes(property)) {
                // log.warning(`[${property}] was not defined! Model and state are out of sync.`);
            }

            // if (value instanceof Space.Input) {
            //     const { content, options } = value;

            //     log.info(`[${property}] → <secret>`);


            //     // const result = recurseProxify(new Space.Input(content, options), { log, options });

            //     return Reflect.set(target, property, proxify(value, { log, options }), receiver);
            // }

            if (value instanceof Space.Input) {
                const { content, options } = value;
        
                const result = Reflect.set(target, property, proxify(content, { log, options }), receiver);
                log.info(`[${property}] → <secret>`);

                return result;
            }

            const result = Reflect.set(target, property, proxify(value, { log, options }), receiver);

            // const original = { ...target };

            // const result = Reflect.set(target, property, value, receiver);

            // const change = diff(original, target);
            // log.info(`[${property}] →`, change);

            if (options?.secret) {
                log.info(`[${property}] → <secret>`);
            } else {
                log.info(`[${property}] → ${JSON.stringify(value)}`);
            }

            return result;
        },
        deleteProperty(target, property) {
            // log.warning(`[${property}] will be deleted! Model and state are out of sync.`);
            log.info(`[${property}] → undefined`);

            return Reflect.deleteProperty(target, property);
        }
    });


}

export { isObject, proxify as recurseProxify }
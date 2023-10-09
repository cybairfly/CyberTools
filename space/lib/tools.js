import { diff } from 'deep-object-diff';
import Space from './index.js';

const revokeString = 'revoke-proxy';
const revokeSymbol = Symbol.for(revokeString);

const isObject = (value) => {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
};

const possiblyDeproxify = input => input[revokeSymbol] ? ({ ...input }) : input;

const recurseRedact = input => {
    if (!isObject(input)) {
        const length = input?.toString?.().length;
        return length ? '●'.repeat(length) : '<secret>';
    }

    if (Array.isArray(input)) {
        return input.map(item => recurseRedact(item));
    }

    return Object.fromEntries(Object.entries(input).map(([key, value]) => [key, recurseRedact(value)]));
}

/** @param {{input: import('./input.js').SpaceInput} | any} */
const recurseProxify = (input, { log, options }) => {
    if (!isObject(input))
        return input;

    // TODO need to proxify properties one by one, this break references to original inputs
    // const proxifyProperty = ([key, value]) => [key, recurseProxify(value, { log })];
    // const target = Object.fromEntries(Object.entries(input).map(proxifyProperty));

    const proxifyProperty = (input, { log, options }) => ([key, value]) => input[key] = recurseProxify(value, { log, options });
    // const root = Object.fromEntries(Object.entries(input).map(proxifyProperty({ log, options })));
    Object.entries(input).forEach(proxifyProperty(possiblyDeproxify(input), { log, options }));

    const { proxy, revoke } = Proxy.revocable(input, {
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

            if (typeof property === 'symbol') {
                return Reflect.set(target, property, value, receiver);
            }


            // if (value[revokeSymbol]) {
            //     target[property] = possiblyDeproxify(target[property]);
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

            const original = JSON.parse(JSON.stringify(target));

            const isSpaceInput = value instanceof Space.Input;
            if (isSpaceInput) {
                const { content, options } = value;

                const result = Reflect.set(target, property, recurseProxify(possiblyDeproxify(content), { log, options }), receiver);

                isObject(value) ?
                    options.redact ?
                        log.info(`[${property}] ►`, recurseRedact(content)) :
                        log.info(`[${property}] ► <secret>`) :
                    log.info(`[${property}] ► <secret>`);


                return result;
            }

            const result = Reflect.set(target, property, recurseProxify(possiblyDeproxify(value), { log, options }), receiver);

            // const result = Reflect.set(target, property, value, receiver);

            const change = diff(original, target);
            // log.info(`[${property}] →`, change);

            if (options?.secret) {
                isObject(value) ?
                    options.redact ?
                        log.info(`[${property}] ►`, recurseRedact(content)) :
                        log.info(`[${property}] ► <secret>`) :
                    log.info(`[${property}] ► <secret>`);
            } else {
                // log.info(`[${property}] ◄`, original);
                // log.info(`[${property}] ►`, target);
                isObject(value) ? log.info(`[${property}] ►`, value) : log.info(`[${property}] ► ${value}`);
            }

            return result;
        },
        deleteProperty(target, property) {
            // log.warning(`[${property}] will be deleted! Model and state are out of sync.`);
            log.info(`[${property}]: undefined`);

            return Reflect.deleteProperty(target, property);
        }
    });

    proxy[revokeSymbol] = revoke;

    return proxy;
}

export { isObject, recurseProxify }
import { diff } from 'deep-object-diff';
import Space from './index.js';

const isObject = (value) => {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
};

const recurseProxify = (input, { log, secret = false }) => {
    if (!isObject(input))
        return input;

    if (input?.constructor?.name !== ({}).constructor.name)
        return new Proxy(input, {
            // get(target, prop, receiver) {
            //     const value = Reflect.get(target, prop, target);
            //     return recurseProxify(value, { log, secret });
            // },
            set(target, property, value, receiver) {
                // if (target?.constructor?.name === Space.Secrets.name) {
                //     const result = Reflect.set(target, property, value, receiver);
                //     log.info(`[${property}] → <redacted>`);

                //     return result;
                // }

                if (!Object.keys(target).includes(property)) {
                    log.warning(`[${property}] was not defined! Model and state are out of sync.`);
                }

                if (secret || property.startsWith('_')) {
                    log.info(`[${property}] → <secret>`);

                    const meh = recurseProxify(value, { log, secret: true });
                    return Reflect.set(target, property, meh, receiver);
                } else {
                    // const original = { ...target };

                    const result = Reflect.set(target, property, value, receiver);

                    // const change = diff(original, target);
                    // log.info(`[${property}] →`, change);
                    log.info(`[${property}] → ${value}`, value);

                    return result;
                }
            },
            deleteProperty(target, property) {
                log.warning(`[${property}] will be deleted! Model and state are out of sync.`);
                log.info(`[${property}] → undefined`);

                return Reflect.deleteProperty(target, property);
            }
        });

    const proxifyProperty = ([key, value]) => [key, recurseProxify(value, { log, secret })];
    const target = Object.fromEntries(Object.entries(input).map(proxifyProperty));

    return new Proxy(target, {
        // get(target, prop, receiver) {
        //     const value = Reflect.get(target, prop, target);
        //     return recurseProxify(value, { log, secret });
        // },
        set(target, property, value, receiver) {
            // if (target?.constructor?.name === Space.Secrets.name) {
            //     const result = Reflect.set(target, property, value, receiver);
            //     log.info(`[${property}] → <redacted>`);

            //     return result;
            // }

            if (!Object.keys(target).includes(property)) {
                log.warning(`[${property}] was not defined! Model and state are out of sync.`);
            }

            if (secret || property.startsWith('_')) {
                log.info(`[${property}] → <secret>`);

                const meh = recurseProxify(value, { log, secret: true });
                return Reflect.set(target, property, meh, receiver);
            } else {
                // const original = { ...target };

                const result = Reflect.set(target, property, value, receiver);

                // const change = diff(original, target);
                // log.info(`[${property}] →`, change);
                log.info(`[${property}] → ${value}`);

                return result;
            }
        },
        deleteProperty(target, property) {
            log.warning(`[${property}] will be deleted! Model and state are out of sync.`);
            log.info(`[${property}] → undefined`);

            return Reflect.deleteProperty(target, property);
        }
    });
}

export { isObject, recurseProxify }
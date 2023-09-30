import { diff } from 'deep-object-diff';

const isObject = (value) => {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
};

const recurseProxify = (input, log) => {
    if (!isObject(input))
        return input;

    return new Proxy(input, {
        get(target, prop, receiver) {
            const value = Reflect.get(target, prop, target);
            return recurseProxify(value, log);
        },
        set(target, property, value, receiver) {
            if (!Object.keys(target).includes(property)) {
                log.warning(`[${property}] was not defined! Model and state are out of sync.`);
            }

            const original = {...target};

            const result = Reflect.set(target, property, value, receiver);

            const change = diff(original, target);
            log.info(`[${property}] →`, change);

            return result;
        },
        deleteProperty(target, property) {
            log.warning(`[${property}] will be deleted! Model and state are out of sync.`);
            log.info(`[${property}] → undefined`);

            return Reflect.deleteProperty(target, property);
        }
    });
}

export { isObject, recurseProxify }
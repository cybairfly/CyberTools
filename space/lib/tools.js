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
                log.warning(`Model and state are out of sync! Missing key: [${property}]`);
            }

            const original = JSON.parse(JSON.stringify(target));

            // console.log("-", target);
            const change = Reflect.set(target, property, value, receiver);
            // console.log("+", target);

            const diffz = diff(original, JSON.parse(JSON.stringify(target)));
            // console.log({...diffz});
            log.info(`[${property}]:`, diffz);

            return change;
        },
        deleteProperty(target, property) {
            log.warning(`Model and state to be out of sync! Removing key: [${property}]`);
            return Reflect.deleteProperty(target, property);
        }
    });
}

export { isObject, recurseProxify }
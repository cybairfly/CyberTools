import { diff } from 'deep-object-diff';
import Space from './index.js';

const string = 'metadata';
const symbol = Symbol.for(string);

const isObject = (value) => {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
};

const isSpecial = input => input?.[symbol];
const deproxify = input => isSpecial ? ({ ...input }) : input;

const enforceOptions = ({ target, property, options, symbol }) => target[property]?.[symbol]?.options || options;

const checkTypes = ({ original, updated }) => {
    if (original === null || updated === null)
        return;

    const typeFail = original && (typeof original !== typeof updated || original === null && updated !== null || Array.isArray(original) && !Array.isArray(updated));

    if (typeFail) {
        console.log({ original, updated });
        throw Error('type mismatch');
    }
};

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

const handleUpdate = ({ log, options }) => ({ target, property, value, receiver }) => {
    if (!options || options?.bypass) {
        const result = Reflect.set(target, property, value, receiver);

        logResult.regular({ property, options, value, log });

        return result;
    }

    if (options?.strict) {
        checkTypes({ original: target[property], updated: value });
    }

    const proxy = proxify({ log, options })(deproxify(value));
    const result = Reflect.set(target, property, proxy, receiver);

    if (options?.secret)
        logResult.special({ property, options, value, log });
    else
        logResult.regular({ property, value, log });

    return result;
}

const logResult = ({
    regular: ({ property, value, log }) => {
        isObject(value) ? log.info(`[${property}] ►`, value) : log.info(`[${property}] ► ${value}`);
    },
    special: ({ property, options, value, log }) => {
        isObject(value) ?
            options.redact ?
                log.info(`[${property}] ►`, recurseRedact(value)) :
                log.info(`[${property}] ► <secret>`) :
            log.info(`[${property}] ► <secret>`);
    }
});

/** @param {{input: import('./input.js').SpaceInput} | any} */
const proxify = ({ log, options }) => input => {
    if (!isObject(input))
        return input;

    if (options) {
        Object
            .entries(input)
            .forEach(([key, value]) => input[key] = proxify({ log, options })(deproxify(value)));
    }

    const { proxy, revoke } = Proxy.revocable(input, {
        get(target, property, receiver) {
            const result = Reflect.get(target, property, receiver);

            if (typeof property === 'symbol') {
                return result;
            }

            if (isSpecial(result)) {
                // result[symbol]?.revoke?.();
                // Reflect.set(target, property, result, receiver);

                return result;
            }

            if (options?.bypass) {
                return result;
            }

            const proxy = proxify({ log })(result);

            return proxy;
        },
        set(target, property, value, receiver) {
            // TODO check options and only proxify from within setter on demand
            options = options || target[property]?.[symbol]?.options;

            if (typeof property === 'symbol') {
                return Reflect.set(target, property, value, receiver);
            }

            if (!Object.keys(target).includes(property)) {
                // log.warning(`[${property}] was not defined! Model and state are out of sync.`);
            }

            if (value instanceof Space.Input) {
                const { content, options } = value;

                return handleUpdate({ log, options })({ target, property, value: content, receiver });
            }

            return handleUpdate({ log, options })({ target, property, value, receiver });
        },
        deleteProperty(target, property) {
            const options = target[property]?.[symbol]?.options;

            if (options?.delete) {
                log.warning(`[${property}] will be deleted! Model and state are out of sync.`);
                log.info(`[${property}]: undefined`);

                return Reflect.deleteProperty(target, property);
            }

            throw Error('cannot delete');
        }
    });

    if (options) {
        proxy[symbol] = { revoke, options };
    } else {
        // proxy[symbol] = { level: 0 };
    }

    return proxy;
}

export { isObject, proxify }
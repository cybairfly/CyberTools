import {
	isObject,
	isSpecial,
	isOptionsUpdated,
	recurseProxify,
	handleUpdate,
	enforceOptions,
	deproxify,
} from './tools.js';

import State from './index.js';

export const string = 'metadata';
export const symbol = Symbol.for(string);

/** @param {import('./input.js').SpaceInput | any} input */
const proxify = ({ log, options }) => input => {
	if (!isObject(input))
		return input;

	if (isSpecial.value(input)) {
		if (isOptionsUpdated({ input, options }))
			recurseProxify({ log, options })(input);
		else
			return input;
	} else if (options)
		recurseProxify({ log, options })(input);

	const { proxy, revoke } = Proxy.revocable(input, {
		get(target, property, receiver) {
			const result = Reflect.get(target, property, receiver);

			const isSpecialExisting = result instanceof State.Input;
			if (isSpecialExisting) {
				const { content, options } = result;

				return proxify({ log, options })(content);
			}

			const bypass = isSpecial.proxy(result) || isSpecial.input(result) || options?.bypass || typeof property === 'symbol';
			if (bypass)
				return result;

			return proxify({ log, options })(result);
		},
		set(target, property, value, receiver) {
			// TODO check options and only proxify from within setter on demand
			if (typeof property === 'symbol')
				return Reflect.set(target, property, value, receiver);

			const isSpecialExisting = target[property] instanceof State.Input;
			if (isSpecialExisting) {
				const { options } = target[property];

				return handleUpdate({ log, options })({ target, property, value, receiver });
			}

			const isSpecialIncoming = value instanceof State.Input;
			if (isSpecialIncoming) {
				const { content } = value;
				options = enforceOptions({ options, updated: value.options });

				return handleUpdate({ log, options })({ target, property, value: content, receiver });
			}

			options = enforceOptions({ options, updated: target[property]?.[symbol]?.options });

			return handleUpdate({ log, options })({ target, property, value, receiver });
		},
		deleteProperty(target, property) {
			options = enforceOptions({ options, updated: target[property]?.[symbol]?.options });

			if (options?.delete) {
				if (!options.bypass) {
					options = null;

					log.warning(`[${property}] will be deleted! Model and state are out of sync.`);
					log.info(`[${property}]: undefined`);
				}

				return Reflect.deleteProperty(target, property);
			}

			throw Error('cannot delete');
		},
	});

	if (options)
		proxy[symbol] = { revoke, options };

	return proxy;
};

export { proxify };

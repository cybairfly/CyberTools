import { proxify } from './proxy.js';

import State from './index.js';

const string = 'metadata';
const symbol = Symbol.for(string);

const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

const isSpecial = {
	input: input => input instanceof State.Input,
	proxy: input => input?.[symbol],
	value: input => input?.[symbol]?.options,
};

const isOptionsUpdated = ({ input, options }) => options && input?.[symbol]?.options && JSON.stringify(options) !== JSON.stringify(input?.[symbol]?.options);

const deproxify = input => ({ ...input, [symbol]: undefined });

const enforceOptions = ({ options, updated }) => updated || options;

const recurseProxify = ({ log, options }) => input =>
	Object
		.entries(input)
		.forEach(([key, value]) => input[key] = proxify({ log, options })(value));

const redact = ({ input, options, root = true, string = '<secret>' }) => {
	if (!isObject(input)) {
		if (root) return string;
		const length = input?.toString?.().length;
		return length ? '●'.repeat(length) : string;
	}

	if (Array.isArray(input))
		return input.map(item => redact({ input: item, options, root: false }));

	return Object.fromEntries(Object.entries(input).map(([key, value]) => [key, redact({ input: value, options, root: false })]));
};

const checkTypes = ({ target, property, value }) => {
	const original = target[property];
	const incoming = value;

	if (!Object.keys(target).includes(property)) {
		// throw Error(`Model has no such property: [${property}]`);
		// log.warning(`[${property}] was not defined! Model and state are out of sync.`);
	}

	if (original === null || incoming === null)
		return;

	const typeFail = (typeof original !== typeof incoming || original === null && incoming !== null || Array.isArray(original) && !Array.isArray(incoming));

	if (typeFail) {
		console.log({ original, incoming });
		throw Error(`Wrong type in strict mode. Make sure state model has the property defined: [${property}]`);
	}
};

const handleUpdate = ({ log, options }) => ({ target, property, value, receiver }) => {
	if (!options || options?.bypass) {
		const result = Reflect.set(target, property, value, receiver);

		outputResult({ property, options, value, log });

		return result;
	}

	if (options?.strict)
		checkTypes({ target, property, value });

	const proxy = proxify({ log, options })(value);
	const result = Reflect.set(target, property, proxy, receiver);

	outputResult({ property, options, value, log });

	return result;
};

const outputResult = ({ property, options, value, log }) => {
	const outputRegular = ({ property, value, log }) =>
		isObject(value) ?
			log.info(`[${property}] ►`, value) :
			log.info(`[${property}] ► ${value}`);

	if (options?.bypass) {
		outputRegular({ property, value, log });

		return;
	}

	if (options?.redact) {
		const result = redact({ input: value, options });
		isObject(result) ?
			log.info(`[${property}] ►`, result) :
			log.info(`[${property}] ► ${result}`);

		return;
	}

	if (options?.secret) {
		const result = redact({ input: value, options });
		isObject(result) ?
			log.info(`[${property}] ►`, result) :
			log.info(`[${property}] ► ${result}`);

		return;
	}

	outputRegular({ property, value, log });
};

export {
	isObject,
	isSpecial,
	isOptionsUpdated,
	checkTypes,
	redact,
	deproxify,
	recurseProxify,
	enforceOptions,
	handleUpdate,
	outputResult,
};

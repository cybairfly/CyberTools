import {redactEngine} from './tools.js';

/**
 * Deeply redacts potentially sensitive input. Works with objects and arrays of arbitrary depth.
 * @param {any} input
 * @param {Array<string>} props List of specific properties to redact. All properties are redacted if not provided.
 */
const redact = (input, props) => redactEngine(input)(props);

const redactCommon = input => redact(input, [
	'token',
	'password',
	'proxyUrl',
	'proxyUrls',
]);

export {
	redact,
	redactCommon,
};

import {redactEngine} from './tools.js';

/**
 * Deeply redacts potentially sensitive input. Works with objects and arrays of arbitrary depth.
 * @param {any} input
 * @param {Array<string>} props List of specific properties to redact. All properties are redacted if not provided.
 */
const redact = props => input => redactEngine(props)(input);

const redactCommon = redact([
	'e-mail',
	'email',
	'token',
	'redact',
	'secret',
	'username',
	'password',
	'proxyUrl',
	'proxyUrls',
]);

export {
	redact,
	redactCommon,
};

import dot from 'dot-object';

import {isObject} from './basic.js';
import {redactEngine} from './gears/index.js';

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
	'bearer',
	'redact',
	'secret',
	'password',
	'proxyUrl',
	'proxyUrls',
]);

const parseInputSchema = input =>
	dot.object(Object
		.fromEntries(Object
			.entries(input)
			.map(([key, value]) =>
				[
					key,
					isObject(value) ?
						parseInputSchema(value) :
						value,
				])));

export {
	redact,
	redactCommon,
	parseInputSchema,
};

import { expect, test } from 'vitest';

import { Logger } from '.';

const log = new Logger().child({prefix: 'Robot'}).child({prefix: 'Human'});
log.setLevel(log.LEVELS.PERF);

const inputs = {
	number: 123,
	string: 'string',
	array: [1, [2], [[3]]],
	combo: [...[123, 'string', [{x: [{y: {token: 'SECRET!'}}]}]], {secret: {token: 'SECRET!'}}],
	object: {a: {b: {c: {token: 'SECRET!'}}}},
};

const values = {
	regular: Object.values(inputs),
	reverse: Object.values(inputs).reverse(),
};

test('normal', () => {
	Object.values(inputs).forEach(value => log.info(value));
	Object.values(inputs).forEach(value => log.debug(value));
	Object.values(inputs).forEach(value => log.error(value));
	Object.values(inputs).forEach(value => log.warning(value));

	log.info(...values.regular.slice(0, 1));
	log.info(...values.regular.slice(0, 2));
	log.info(...values.regular.slice(0, 3));
	log.info(...values.regular.slice(0, 4));
	log.info(...values.regular.slice(0, 5));
	log.info(...values.reverse.slice(-1));
	log.info(...values.reverse.slice(-2));
	log.info(...values.reverse.slice(-3));
	log.info(...values.reverse.slice(-4));
	log.info(...values.reverse.slice(-5));

	log.debug(...values.regular.slice(0, 1));
	log.debug(...values.regular.slice(0, 2));
	log.debug(...values.regular.slice(0, 3));
	log.debug(...values.regular.slice(0, 4));
	log.debug(...values.regular.slice(0, 5));
	log.debug(...values.reverse.slice(-1));
	log.debug(...values.reverse.slice(-2));
	log.debug(...values.reverse.slice(-3));
	log.debug(...values.reverse.slice(-4));
	log.debug(...values.reverse.slice(-5));

	log.error(...values.regular.slice(0, 1));
	log.error(...values.regular.slice(0, 2));
	log.error(...values.regular.slice(0, 3));
	log.error(...values.regular.slice(0, 4));
	log.error(...values.regular.slice(0, 5));
	log.error(...values.reverse.slice(-1));
	log.error(...values.reverse.slice(-2));
	log.error(...values.reverse.slice(-3));
	log.error(...values.reverse.slice(-4));
	log.error(...values.reverse.slice(-5));

	log.warning(...values.regular.slice(0, 1));
	log.warning(...values.regular.slice(0, 2));
	log.warning(...values.regular.slice(0, 3));
	log.warning(...values.regular.slice(0, 4));
	log.warning(...values.regular.slice(0, 5));
	log.warning(...values.reverse.slice(-1));
	log.warning(...values.reverse.slice(-2));
	log.warning(...values.reverse.slice(-3));
	log.warning(...values.reverse.slice(-4));
	log.warning(...values.reverse.slice(-5));
});

test('bypass', () => {
	Object.values(inputs).forEach(value => log.bypass.info(value));
	Object.values(inputs).forEach(value => log.bypass.debug(value));
	Object.values(inputs).forEach(value => log.bypass.error(value));
	Object.values(inputs).forEach(value => log.bypass.warning(value));

	log.bypass.info(...values.regular.slice(0, 1));
	log.bypass.info(...values.regular.slice(0, 2));
	log.bypass.info(...values.regular.slice(0, 3));
	log.bypass.info(...values.regular.slice(0, 4));
	log.bypass.info(...values.regular.slice(0, 5));
	log.bypass.info(...values.reverse.slice(-1));
	log.bypass.info(...values.reverse.slice(-2));
	log.bypass.info(...values.reverse.slice(-3));
	log.bypass.info(...values.reverse.slice(-4));
	log.bypass.info(...values.reverse.slice(-5));

	log.bypass.debug(...values.regular.slice(0, 1));
	log.bypass.debug(...values.regular.slice(0, 2));
	log.bypass.debug(...values.regular.slice(0, 3));
	log.bypass.debug(...values.regular.slice(0, 4));
	log.bypass.debug(...values.regular.slice(0, 5));
	log.bypass.debug(...values.reverse.slice(-1));
	log.bypass.debug(...values.reverse.slice(-2));
	log.bypass.debug(...values.reverse.slice(-3));
	log.bypass.debug(...values.reverse.slice(-4));
	log.bypass.debug(...values.reverse.slice(-5));

	log.bypass.error(...values.regular.slice(0, 1));
	log.bypass.error(...values.regular.slice(0, 2));
	log.bypass.error(...values.regular.slice(0, 3));
	log.bypass.error(...values.regular.slice(0, 4));
	log.bypass.error(...values.regular.slice(0, 5));
	log.bypass.error(...values.reverse.slice(-1));
	log.bypass.error(...values.reverse.slice(-2));
	log.bypass.error(...values.reverse.slice(-3));
	log.bypass.error(...values.reverse.slice(-4));
	log.bypass.error(...values.reverse.slice(-5));

	log.bypass.warning(...values.regular.slice(0, 1));
	log.bypass.warning(...values.regular.slice(0, 2));
	log.bypass.warning(...values.regular.slice(0, 3));
	log.bypass.warning(...values.regular.slice(0, 4));
	log.bypass.warning(...values.regular.slice(0, 5));
	log.bypass.warning(...values.reverse.slice(-1));
	log.bypass.warning(...values.reverse.slice(-2));
	log.bypass.warning(...values.reverse.slice(-3));
	log.bypass.warning(...values.reverse.slice(-4));
	log.bypass.warning(...values.reverse.slice(-5));
});

test('format', () => {
	Object.values(inputs).forEach(value => log.format.info(value));
	Object.values(inputs).forEach(value => log.format.debug(value));
	Object.values(inputs).forEach(value => log.format.error(value));
	Object.values(inputs).forEach(value => log.format.warning(value));

	log.format.info(...values.regular.slice(0, 1));
	log.format.info(...values.regular.slice(0, 2));
	log.format.info(...values.regular.slice(0, 3));
	log.format.info(...values.regular.slice(0, 4));
	log.format.info(...values.regular.slice(0, 5));
	log.format.info(...values.reverse.slice(-1));
	log.format.info(...values.reverse.slice(-2));
	log.format.info(...values.reverse.slice(-3));
	log.format.info(...values.reverse.slice(-4));
	log.format.info(...values.reverse.slice(-5));

	log.format.debug(...values.regular.slice(0, 1));
	log.format.debug(...values.regular.slice(0, 2));
	log.format.debug(...values.regular.slice(0, 3));
	log.format.debug(...values.regular.slice(0, 4));
	log.format.debug(...values.regular.slice(0, 5));
	log.format.debug(...values.reverse.slice(-1));
	log.format.debug(...values.reverse.slice(-2));
	log.format.debug(...values.reverse.slice(-3));
	log.format.debug(...values.reverse.slice(-4));
	log.format.debug(...values.reverse.slice(-5));

	log.format.error(...values.regular.slice(0, 1));
	log.format.error(...values.regular.slice(0, 2));
	log.format.error(...values.regular.slice(0, 3));
	log.format.error(...values.regular.slice(0, 4));
	log.format.error(...values.regular.slice(0, 5));
	log.format.error(...values.reverse.slice(-1));
	log.format.error(...values.reverse.slice(-2));
	log.format.error(...values.reverse.slice(-3));
	log.format.error(...values.reverse.slice(-4));
	log.format.error(...values.reverse.slice(-5));

	log.format.warning(...values.regular.slice(0, 1));
	log.format.warning(...values.regular.slice(0, 2));
	log.format.warning(...values.regular.slice(0, 3));
	log.format.warning(...values.regular.slice(0, 4));
	log.format.warning(...values.regular.slice(0, 5));
	log.format.warning(...values.reverse.slice(-1));
	log.format.warning(...values.reverse.slice(-2));
	log.format.warning(...values.reverse.slice(-3));
	log.format.warning(...values.reverse.slice(-4));
	log.format.warning(...values.reverse.slice(-5));
});

test('custom', () => {
	const log = new Logger({redactor: null}).child({prefix: 'Robot'}).child({prefix: 'Human'});

	Object.values(inputs).forEach(value => log.redact.format.info(value));
	Object.values(inputs).forEach(value => log.redact.format.debug(value));
	Object.values(inputs).forEach(value => log.redact.format.error(value));
	Object.values(inputs).forEach(value => log.redact.format.warning(value));

	log.redact.format.info(...values.regular.slice(0, 1));
	log.redact.format.info(...values.regular.slice(0, 2));
	log.redact.format.info(...values.regular.slice(0, 3));
	log.redact.format.info(...values.regular.slice(0, 4));
	log.redact.format.info(...values.regular.slice(0, 5));
	log.redact.format.info(...values.reverse.slice(-1));
	log.redact.format.info(...values.reverse.slice(-2));
	log.redact.format.info(...values.reverse.slice(-3));
	log.redact.format.info(...values.reverse.slice(-4));
	log.redact.format.info(...values.reverse.slice(-5));

	log.redact.format.debug(...values.regular.slice(0, 1));
	log.redact.format.debug(...values.regular.slice(0, 2));
	log.redact.format.debug(...values.regular.slice(0, 3));
	log.redact.format.debug(...values.regular.slice(0, 4));
	log.redact.format.debug(...values.regular.slice(0, 5));
	log.redact.format.debug(...values.reverse.slice(-1));
	log.redact.format.debug(...values.reverse.slice(-2));
	log.redact.format.debug(...values.reverse.slice(-3));
	log.redact.format.debug(...values.reverse.slice(-4));
	log.redact.format.debug(...values.reverse.slice(-5));

	log.redact.format.error(...values.regular.slice(0, 1));
	log.redact.format.error(...values.regular.slice(0, 2));
	log.redact.format.error(...values.regular.slice(0, 3));
	log.redact.format.error(...values.regular.slice(0, 4));
	log.redact.format.error(...values.regular.slice(0, 5));
	log.redact.format.error(...values.reverse.slice(-1));
	log.redact.format.error(...values.reverse.slice(-2));
	log.redact.format.error(...values.reverse.slice(-3));
	log.redact.format.error(...values.reverse.slice(-4));
	log.redact.format.error(...values.reverse.slice(-5));

	log.redact.format.warning(...values.regular.slice(0, 1));
	log.redact.format.warning(...values.regular.slice(0, 2));
	log.redact.format.warning(...values.regular.slice(0, 3));
	log.redact.format.warning(...values.regular.slice(0, 4));
	log.redact.format.warning(...values.regular.slice(0, 5));
	log.redact.format.warning(...values.reverse.slice(-1));
	log.redact.format.warning(...values.reverse.slice(-2));
	log.redact.format.warning(...values.reverse.slice(-3));
	log.redact.format.warning(...values.reverse.slice(-4));
	log.redact.format.warning(...values.reverse.slice(-5));
});

import console from 'console';

import { jest } from '@jest/globals';

import { Space, space } from './space.js';
import { execute, logs } from './tools.js';

global.console = console;
jest.spyOn(console, 'log').mockImplementation();

const actions = {
	default: ([key]) => input => space[key] = input,
	// delete: X => I => delete space[ X ],
};

const groups = {
	'keep root': [
		{ action: ([key]) => input => space[key] = input, input: ([key]) => space[key] },
	],
	'keep deep': [
		{ action: ([key, subkey]) => input => space[key].a.b.c[subkey] = input, input: ([key, subkey]) => space[key].a.b.c[subkey], subkey: 'number' },
		{ action: ([key, subkey]) => input => space[key].a.b.c[subkey] = input, input: ([key, subkey]) => space[key].a.b.c[subkey], subkey: 'string' },
		{ action: ([key, subkey]) => input => space[key].a.b.c[subkey] = input, input: ([key, subkey]) => space[key].a.b.c[subkey], subkey: 'boolean' },
		{ action: ([key, subkey]) => input => space[key].a.b.c[subkey] = input, input: ([key, subkey]) => space[key].a.b.c[subkey], subkey: 'null' },
		{ action: ([key, subkey]) => input => space[key].a.b.c[subkey] = input, input: ([key, subkey]) => space[key].a.b.c[subkey], subkey: 'array' },
		{ action: ([key, subkey]) => input => space[key].a.b.c[subkey] = input, input: ([key, subkey]) => space[key].a.b.c[subkey], subkey: 'arrow' },
		{ action: ([key, subkey]) => input => space[key].a.b.c[subkey] = input, input: ([key, subkey]) => space[key].a.b.c[subkey], subkey: 'method' },
	],
	'keep with updated options': [
		{ action: actions.default, input: new Space.Input(space.one, { bypass: true, delete: false, redact: false, secret: false, strict: false }) },
		{ action: ([key]) => input => space[key] = input, input: space.one },
		{ action: actions.default, input: new Space.Input(space.one, { bypass: false, delete: true, redact: false, secret: false, strict: false }) },
		{ action: ([key]) => input => space[key] = input, input: space.one },
		{ action: actions.default, input: new Space.Input(space.one, { bypass: false, delete: false, redact: true, secret: false, strict: false }) },
		{ action: ([key]) => input => space[key] = input, input: space.one },
		{ action: actions.default, input: new Space.Input(space.one, { bypass: false, delete: false, redact: false, secret: true, strict: false }) },
		{ action: ([key]) => input => space[key] = input, input: space.one },
		{ action: actions.default, input: new Space.Input(space.one, { bypass: false, delete: false, redact: false, secret: false, strict: true }) },
		{ action: ([key]) => input => space[key] = input, input: space.one },
	],
	'random values': [
		{ action: ([key, subkey]) => input => space[key].a.b.c[subkey] = input, input: ([key, subkey]) => 321, subkey: 'number' },
		{ action: ([key, subkey]) => input => space[key].a.b.c[subkey] = input, input: ([key, subkey]) => 'random', subkey: 'string' },
		{ action: ([key, subkey]) => input => space[key].a.b.c[subkey] = input, input: ([key, subkey]) => false, subkey: 'boolean' },
		{ action: ([key, subkey]) => input => space[key].a.b.c[subkey] = input, input: ([key, subkey]) => null, subkey: 'null' },
		{ action: ([key, subkey]) => input => space[key].a.b.c[subkey] = input, input: ([key, subkey]) => [3, 2, 1], subkey: 'array' },
	],
	'random types': [
		// { action: ([ key, subkey ]) => input => space.one.a.b.c = input, input: ([ key, subkey ]) => space[ key ].a.b.c[ subkey ], subkey: 'number' },
		{ action: actions.default, input: ({ a: { b: { c: 1 } } }) },
		{ action: actions.default, input: new Space.Input({ a: { b: { c: 4 }, more: { z: 123 }, zero: [1, 2, 3] } }, { bypass: false, secret: true, redact: true, strict: false, delete: true }) },
		{ action: actions.default, input: undefined },
		{ action: actions.default, input: 2 },
		{ action: actions.default, input: ({ a: { b: { c: 2 } } }) },
		{ action: actions.default, input: new Space.Input({ a: { b: { c: 4 }, more: { z: 123 }, zero: [1, 2, 3] } }, { bypass: false, secret: true, redact: true, strict: false, delete: true }) },
		{ action: actions.default, input: undefined },
		{ action: actions.default, input: new Space.Input({ a: { b: { c: 4 }, more: { z: 123 }, zero: [1, 2, 3] } }, { bypass: true, redact: true, secret: true, strict: true, delete: true }) },
		{ action: actions.default, input: undefined },
		{ action: actions.default, input: new Space.Input({ a: { b: { c: 4 }, more: { z: 123 }, zero: [1, 2, 3] } }, { bypass: false, redact: false, secret: false, strict: false, delete: false }) },
		{ action: actions.default, input: undefined },
		{ action: actions.default, input: ({ a: 1 }) },
		{ action: actions.default, input: ([key]) => ({ ...space[key], b: 2 }) },
		{ action: actions.default, input: 123 },
		{ action: actions.default, input: ({ b: { c: 1 } }) },
		{ action: actions.default, input: ({ a: { b: { c: 5 } } }) },
		{ action: actions.default, input: 3 },
		{ action: actions.default, input: 2 },
		{ action: actions.default, input: 1 },
		{ action: actions.default, input: 0 },
		{ action: actions.default, input: new Space.Input({ a: { b: { c: 4 }, more: { z: 123 }, zero: [1, 2, 3] } }, { bypass: false, redact: false, secret: false, strict: false, delete: false }) },
		{ action: actions.default, input: undefined },
		{ action: actions.default, input: ({ a: 1 }) },
		{ action: actions.default, input: ([key]) => ({ ...space[key], b: 2 }) },
		{ action: actions.default, input: 123 },
		{ action: actions.default, input: ({ b: { c: 1 } }) },
		{ action: actions.default, input: ({ a: { b: { c: 2 } } }) },
		{ action: actions.default, input: new Space.Input({ a: { b: { c: 4 }, more: { z: 123 }, zero: [1, 2, 3] } }, { bypass: false, secret: true, redact: true, strict: false, delete: true }) },
		{ action: actions.default, input: undefined },
		{ action: actions.default, input: new Space.Input({ a: { b: { c: 4 }, more: { z: 123 }, zero: [1, 2, 3] } }, { bypass: true, redact: true, secret: true, strict: true, delete: true }) },
		{ action: actions.default, input: undefined },
	],
	'random types strict': [
		// { action: actions.default, input: new Space.Input(space.one, { bypass: false, delete: false, redact: false, secret: false, strict: true }) },
	],
};

const keysToTest = ([key]) => [
	'one',
].includes(key);

Object.entries(space)
	.filter(keysToTest)
	.forEach(([key, value]) =>
		Object.entries(groups).forEach(([title, tests]) => {
			describe(title, () => {
				tests.forEach(({ action, input, subkey }) => {
					const inputString = `${key && `[${key}]`} ${subkey && `-> [${subkey}]` || ':'} ${typeof input === 'function' ? input.toString() : JSON.stringify(input?.content || input)}`;

					test(inputString, () => {
						execute({
							action,
							input,
							state: space,
							// options,
							props: [key, subkey],
						});
					});
				});
			});
		}));

afterAll(() => {
	console.warn(...logs);
});

// describe("iterate", () => {
// 	afterAll(() => {
// 		logSpy.mockRestore();
// 		console.log = original;
// 		console.log(logs);
// 	});

// 	iterateinputs({ inputs, state: space });
// });

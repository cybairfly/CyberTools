import { Log } from '@apify/log';
import { jest } from '@jest/globals';

import { Space } from './space.js';
import { symbol } from '../lib/proxy.js';
import { isObject, outputResult, redact } from '../lib/tools.js';
// import { logs } from './index.test.js';

const logs = [];
const logger = new Log();
const log = logger.child({ prefix: Space.name });

const iterateInputs = ({ inputs, state, property = 'test' }) => inputs.map(input => test(JSON.stringify(extractContent(input)), execute({ input, state, property })));

const updateProperty = ({ target, property, value, options } = {}) => Reflect.set(target, property, value);

const extractContent = input => input instanceof Space.Input ? input.content : input;

const execute = ({ action, input, state, options, props }) => {
	const original = console.log;
	const logSpy = jest.spyOn(console, 'log');

	const [rootProp, leafProp] = props;
	const isInputFun = typeof input === 'function';
	const inputValue = isInputFun ? input(props) : input;
	const inputValueContent = inputValue instanceof Space.Input ? inputValue.content : inputValue;
	options = inputValue instanceof Space.Input ? inputValue.options : state[rootProp]?.[symbol]?.options;

	const record = {
		real: null,
		mock: null,
	};

	if (input === undefined) {
		if (options?.delete || !options) {
			const deletion = () => delete state[rootProp];
			expect(deletion).not.toThrow();
			expect(state[rootProp]).toBeUndefined();
			console.log('DELETE: OK');

			return;
		}

		expect(() => delete state[rootProp]).toThrow();
		console.log('DELETE: THROW');

		return;
	}

	logSpy.mockImplementation((...args) => record.real = args);
	action(props)(inputValue);

	if (options?.ignore)
		expect(JSON.stringify(state[rootProp])).toStrictEqual(JSON.stringify(inputValueContent));
	else {
		const currentState = typeof input === 'function' ? input(props) : state[rootProp];
		const currentStateContent = currentState instanceof Space.Input ? currentState.content : currentState;

		try {
			expect(currentStateContent).toStrictEqual(inputValueContent);
		} catch (error) {
			expect(currentStateContent).toStrictEqual(inputValueContent);
		}
	}

	logSpy.mockImplementation((...args) => record.mock = args);
	outputResult({ property: leafProp || rootProp, options, value: inputValueContent, log });

	logSpy.mockRestore();
	// console.log = original;
	console.log(options);
	console.log(...record.real);
	console.log(...record.mock);
	console.log('\n');

	const [line] = record.real;

	expect(record.real).toEqual(record.mock);

	const renderSecret = !options?.bypass && (options?.redact || options?.secret);
	if (inputValueContent === undefined) {
		renderSecret ?
			expect(line).toContain('<secret>') :
			expect(line).toContain('undefined');
	} else {
		const redactOutput = renderSecret ? redact({ input: inputValueContent, options }) : inputValueContent;
		const expectOutput = (isObject(redactOutput) || redactOutput === null) ? JSON.stringify(redactOutput) : (redactOutput?.toString() || redactOutput);

		try {
			expect(line).toContain(expectOutput);
		} catch (error) {
			logs.push(error.message);
		}
	}
};

export {
	logs,
	execute,
};

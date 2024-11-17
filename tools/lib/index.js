import * as basic from './basic.js';
import * as object from './object.js';
import * as string from './string.js';
import {TrafficManager} from './traffic/index.js';

export * as dot from 'dot-object';

export const tools = {
	...basic,
	object,
	string,
	TrafficManager,
};

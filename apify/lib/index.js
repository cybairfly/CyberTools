import * as tools from './tools.js';
import {Watcher} from './watcher/index.js';

export const apify = {
	Watcher,
	...tools,
};

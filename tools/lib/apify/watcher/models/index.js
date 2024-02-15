import {config} from './config.js';
import * as force from './force.js';
import {input} from './input.js';
import {scraper, selector, selectors} from './parts.js';
import {state} from './state.js';

export const models = {
	force,
	input,
	config,
	state,
	scraper,
	// scrapers,
	selector,
	selectors,
};

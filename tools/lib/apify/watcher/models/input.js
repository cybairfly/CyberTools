import {config} from './config.js';
import * as force from './force.js';
import {login, selectors} from './parts.js';

export const input = {
	...force.input,
	url: '',
	cycle: '',
	limit: 0,
	watchDelay: 0,
	config: '',
	dataset: '',
	// filters: '[() => {}]',
	keywords: [],
	alerts: {
		limit: 0,
		enable: true,
		channel: '',
		mail: {
			enable: true,
			address: '',
		},
		ntfy: {
			enable: true,
			channel: '',
		},
	},
	proxy: {
		apifyProxyGroups: [''],
		apifyProxyCountry: '',
	},
	login,
	// scrapers: '',
	selectors,
	session: {
		enable: true,
	},
	// login: {
	// 	url: '',
	// 	username: '',
	// 	password: '',
	// 	selectors: {
	// 		username: '',
	// 		password: '',
	// 		submit: '',
	// 	},
	// 	mfa: {
	// 		selectors: {
	// 			input: '',
	// 			submit: '',
	// 		},
	// 	},
	// },
};

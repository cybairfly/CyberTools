export const login = {
	url: '',
	username: '',
	password: '',
	selectors: {
		username: '',
		password: '',
		submit: '',
	},
	mfa: {
		selectors: {
			input: '',
			submit: '',
		},
	},
};

export const selector = '';

export const selectors = [selector];

export const scraper = {
	name: '',

	selectors: [''],

	/** @param {HTMLAnchorElement} node */
	extractor: node => node.innerText,

	/** @param {string} text */
	predicate: text => {},
};

// export const scraper = new Scraper();

// export const scrapers = {
// 	name: scraper,
// };

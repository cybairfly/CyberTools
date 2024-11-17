import {EVENTS} from 'cyber-consts';
import {Logue} from 'cyber-logue';

import {Handlers} from './handlers.js';
import {urlParamsToEllipsis} from '../string.js';

export class TrafficManager {
	#log = new Logue().child({prefix: this.constructor.name});

	#page;

	#host;

	#handlers;

	constructor(page) {
		this.#page = page;
		this.#handlers = Handlers(this.#log);
		this.initEventLogger();
	}

	/**
	 * @param {{allow?: {hosts: Array<string>, types: Array<string>}, block: {hosts: Array<string>, types: Array<string>}}} options - An object containing the allow and block lists.
	 */
	filter = async ({allow = {hosts: [], types: [], rules: []}, block = {hosts: [], types: [], regex: []}}) => {
		const lists = {
			hosts: block.hosts.filter(host => !allow.hosts.includes(host)),
			types: block.types.filter(type => !allow.types.includes(type)),
		};

		const isRouteMatch = route => (url => ({
			types: route => {
				const isTypesMatch = lists.types.includes(route.request().resourceType());
				if (isTypesMatch) {
					const isHostsMatchFuzzy = !allow.hosts.some(host => url.includes(host));
					if (isHostsMatchFuzzy) {
						const isHostsMatchExact = (url => !allow.hosts.some(host => url.host.includes(host)))(new URL(url));
						if (isHostsMatchExact)
							return true;
					}
				}
			},
			hosts: route => {
				const isHostsMatchFuzzy = lists.hosts.some(host => url.includes(host));
				if (isHostsMatchFuzzy) {
					const isHostsMatchExact = (url => lists.hosts.some(host => url.host.includes(host)))(new URL(url));
					if (isHostsMatchExact)
						return true;
				}
			},
			regex: route => {
				const isRegexMatch = lists.regex.some(item => url.match(item));
				if (isRegexMatch)
					return true;
			},
		}))(route.request().url());

		await this.#page.route('**/*', route => {
			// const isMatch = {
			// 	type: lists.types.includes(route.request().resourceType()) && (allow.hosts.every(host => !url.includes(host)) || (url => allow.hosts.every(host => !url.host.includes(host)))(new URL(route.request().url()))),
			// 	host: lists.hosts.find(host => route.request().url().includes(host)) && lists.hosts.some(host => new URL(route.request().url()).host.includes(host)),
			// };

			const tests = {
				block: {
					isTypesMatch: route => lists.types.includes(route.request().resourceType()),
					isHostsMatch: route => lists.hosts.some(host => route.request().url().includes(host)) && lists.hosts.some(host => new URL(route.request().url()).host.includes(host)),
					// isHostsMatchExact: route => lists.hosts.some(host => new URL(route.request().url()).host.includes(host)),
					isRegexMatch: route => lists.regex.some(item => route.request().url().match(item)),
				},
				allow: {
					// implicit
					// isHostsMatchFuzzy: route => allow.hosts.some(host => route.request().url().includes(host)),
					// isHostsMatchExact: route => allow.hosts.some(host => new URL(route.request().url()).host.includes(host)),
					isRegexMatch: route => allow.regex.some(item => route.request().url().match(item)),
				},
			};

			const rules = {
				// block = () => lists.types.includes(route.request().resourceType()) || (lists.hosts.find(host => route.request().url().includes(host)) && lists.hosts.some(host => new URL(route.request().url()).host.includes(host)));
				block: route => tests.block.isTypesMatch(route) || tests.block.isHostsMatch(route) || tests.block.isRegexMatch(route),
				// allow = () => allow.hosts.some(host => url.includes(host)) && (url => allow.hosts.some(host => url.host.includes(host)))(new URL(url));
				allow: route => tests.allow.isRegexMatch(route),
				// allow: route => tests.allow.isHostsMatchFuzzy(route) && tests.allow.isHostsMatchExact(route) || tests.allow.isRegexMatch(route),
			};

			// const isMatch = isRouteMatch(route);
			const doBlock = rules.block(route) && !rules.allow(route);
			// const doBlock = isMatch.types() || isMatch.hosts() || isMatch.regex();
			// console.log(`${new URL(route.request().url()).hostname}`);

			return doBlock
				? route.abort()
				: route.continue().catch(error => console.warn(error.message));
		});
	};

	routeFilter = {
		normal: rules => route =>
			rules.block(route) && !rules.allow(route) ?
				route.abort() :
				route.continue(),
		custom: (rules, options) => url => route =>
			rules.block(route) && !rules.allow(route) ?
				(route.abort(), this.logRouteAbort(route, url, options)) :
				route.continue(),
	};

	resetHandler = {
		navigation: (eventName = EVENTS.framenavigated) => (page, handler) => (oldUrl, oldHandler) => event => {
			const url = new URL(page.url());

			if (oldHandler)
				page.once(eventName, handler(url));
			else
				handler({})(event);

			page.once(EVENTS.framenavigated, this.resetHandler.navigation(eventName)(page, handler)(url, true));
		},
		traffic: eventName => (page, handler) => (oldUrl = {}, oldHandler) => event => {
			const url = new URL(page.url());

			if (url?.href === oldUrl?.href || url?.host === oldUrl?.host) {
				page.once(EVENTS.framenavigated, this.resetHandler.traffic(eventName)(page, handler)(url, oldHandler));

				return;
			}

			const currentHandler = handler(url);
			page.on(eventName, currentHandler);

			if (oldHandler)
				page.off(eventName, oldHandler);
			else
				page.once(EVENTS.framenavigated, this.resetHandler.traffic(eventName)(page, handler)(url, currentHandler));
		},
	};

	initEventLogger = ({input, options = {}}) => {
		// page.once(EVENTS.framenavigated, this.resetHandler.navigation(EVENTS.framenavigated)(page, urlLogger(page, {debug: input.debug}))());

		if (true) {
		// if (input.debug) {
			// page.on(EVENTS.framenavigated, navigationLogger(input));
			// page.on(EVENTS.domcontentloaded, () => console.log(createHeader(EVENTS.domcontentloaded, {center: true, padder: '○'})));
			// page.on(EVENTS.load, () => console.log(createHeader(EVENTS.load, {center: true, padder: '●'})));

			if (true) {
			// if (options.debug.traffic.enable) {
				this.#page.once(EVENTS.framenavigated, this.resetHandler.traffic(EVENTS.request)(this.#page, this.#handlers.request(options))());
				this.#page.once(EVENTS.framenavigated, this.resetHandler.traffic(EVENTS.response)(this.#page, this.#handlers.response(options))());
			}
		}
	};

	/**
	 * @param {{allow?: {hosts: Array<string>, types: Array<string>}, block: {hosts: Array<string>, types: Array<string>}}} options - An object containing the allow and block lists.
	 */
	initTrafficFilter = async ({allow = {hosts: [], types: [], regex: []}, block = {hosts: [], types: [], regex: []}}, options = {}) => {
		// const {resourceTypes, urlPatterns} = options.trafficFilter;
		// const isRouteMatch = {
		// 	other: (lists => route => lists.other.some(item => route.request().url().includes(item)))(urlPatterns),
		// 	pattern: (urlPatterns => route => urlPatterns.some(pattern => route.request().url().includes(pattern)) && lists.hosts.some(host => new URL(route.request().url()).host.includes(host)))(urlPatterns),
		// 	resource: (resourceTypes => route => resourceTypes.some(resource => route.request().resourceType().includes(resource)))(resourceTypes),
		// };

		const lists = {
			hosts: block.hosts.filter(host => !allow.hosts.includes(host)),
			types: block.types.filter(type => !allow.types.includes(type)),
		};

		const tests = {
			block: {
				isTypesMatch: route => lists.types.includes(route.request().resourceType()),
				isHostsMatch: route => lists.hosts.some(host => route.request().url().includes(host)) && lists.hosts.some(host => new URL(route.request().url()).host.includes(host)),
				// isHostsMatchExact: route => lists.hosts.some(host => new URL(route.request().url()).host.includes(host)),
				isRegexMatch: route => allow.regex.some(item => route.request().url().match(item)),
			},
			allow: {
				// implicit
				// isHostsMatchFuzzy: route => allow.hosts.some(host => route.request().url().includes(host)),
				// isHostsMatchExact: route => allow.hosts.some(host => new URL(route.request().url()).host.includes(host)),
				isRegexMatch: route => allow.regex.some(item => route.request().url().match(item)),
			},
		};

		const rules = (tests => ({
			// block = () => lists.types.includes(route.request().resourceType()) || (lists.hosts.find(host => route.request().url().includes(host)) && lists.hosts.some(host => new URL(route.request().url()).host.includes(host)));
			block: route => tests.block.isTypesMatch(route) || tests.block.isHostsMatch(route) || tests.block.isRegexMatch(route),
			// allow = () => allow.hosts.some(host => url.includes(host)) && (url => allow.hosts.some(host => url.host.includes(host)))(new URL(url));
			allow: route => tests.allow.isRegexMatch(route),
			// allow: route => tests.allow.isHostsMatchFuzzy(route) && tests.allow.isHostsMatchExact(route) || tests.allow.isRegexMatch(route),
		}))(tests);

		// const doBlock = rules.block(route) && !rules.allow(route);

		// const isRouteMatch = {
		// 	type: route => {
		// 		const isTypeMatch = lists.types.includes(route.request().resourceType());
		// 		if (isTypeMatch) {
		// 			const isHostMatchFuzzy = (url => !allow.hosts.some(host => url.includes(host)))(route.request().url());
		// 			if (isHostMatchFuzzy) {
		// 				const isHostMatchExact = (url => !allow.hosts.some(host => url.host.includes(host)))(new URL(route.request().url()));
		// 				if (isHostMatchExact)
		// 					return true;
		// 			}
		// 		}

		// 		return false;
		// 	},
		// 	host: route => {
		// 		const isHostMatchFuzzy = (url => lists.hosts.some(host => url.includes(host)))(route.request().url());
		// 		if (isHostMatchFuzzy) {
		// 			const isHostMatchExact = (url => lists.hosts.some(host => url.host.includes(host)) && !allow.hosts.some(host => url.host.includes(host)))(new URL(route.request().url()));
		// 			if (isHostMatchExact)
		// 				return true;
		// 		}

		// 		return false;
		// 	},
		// };

		this.interceptNavigation(new URL(this.#page.url()));
		this.updateTrafficFilter(this.routeFilter.normal(rules));

		this.#page.on('navigation', ({url}) => this.updateTrafficFilter(this.routeFilter.custom(rules, options)(url)));

		// TODO maybe unroute
		// this.#page.on('navigation', async ({url}) => {
		// 	await this.#page.unroute('**/*');
		// 	// await this.#page.unrouteAll();
		// 	this.updateTrafficFilter(this.routeFilter.custom(isRouteMatch, options)(url));
		// });
	};

	updateTrafficFilter = async filter => this.#page.route('**/*', filter);

	broadcastNavigation = ({url, oldUrl}) => this.#page.emit('navigation', {url, oldUrl});

	interceptNavigation = oldUrl =>
		this.#page.waitForURL(url => url.href !== oldUrl.href, {
			waitUntil: 'commit',
			timeout: 0,
		})
			.then(nil => new URL(this.#page.url()))
			.then(url => this.interceptNavigation(url) && url)
			.then(url => this.broadcastNavigation({url}) && url)
			.catch(error => { });

	logRouteAbort = (route, url, options) => {
		const {fullUrls = false, hostOnly = false, hideFilter = false} = options.debug?.traffic || {};

		const request = route.request();
		const requestUrl = request.url();
		const method = request.method();
		const type = request.resourceType();
		const {host} = url;

		if (!hideFilter) {
			const cols = {
				status: '-'.repeat(3),
				method: method.padEnd(7, '-'),
				type: type.padEnd(11, '-'),
				host: requestUrl.startsWith(host) ? host : '-'.repeat(host.length),
				url: !fullUrls ? urlParamsToEllipsis(requestUrl) : requestUrl,
			};

			this.#log.info(`■ RX | ${cols.status} | ${cols.method} | ${cols.type} | ${cols.host} | ${cols.url}`);
		}
	};
}

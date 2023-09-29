const EVENTS = {
	console: 'console',
	dialog: 'dialog',
	framenavigated: 'framenavigated',
	domcontentloaded: 'domcontentloaded',
	error: 'error',
	load: 'load',
	networkidle: 'networkidle',
	pageerror: 'pageerror',
	popup: 'popup',
	request: 'request',
	requestfailed: 'requestfailed',
	requestfinished: 'requestfinished',
	response: 'response',
};

const SESSION = {
	retireStatusCodes: [401, 403, 429],
};

const TIMEOUTS = {
	one: 1 * 1000,
	five: 5 * 1000,
	ten: 10 * 1000,
	half: 15 * 1000,
	default: 30 * 1000,
	double: 2 * 30 * 1000,
	triple: 3 * 30 * 1000,
};

export {
	EVENTS,
	SESSION,
	TIMEOUTS,
};

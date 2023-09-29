import {Log, LEVELS} from '@apify/log';

// eslint-disable-next-line import/no-relative-packages
import {redactCommon} from '../../gears/lib/index.js';

const {DEBUG, INFO, WARNING, ERROR} = LEVELS;

class Logger extends Log {
	info = (...args) => {
		if (typeof args[args.length - 1] === 'object')
			super.info(`${args.slice(0, -1).join(', ')}`, args[args.length - 1]);
		else
			super.info(`${args.join(' ')}`);
	};

	bypass = {
		info: (...args) => [DEBUG, INFO].includes(this.getLevel()) && console.log('INFO', ...args),
		debug: (...args) => this.getLevel() === DEBUG && console.log('DEBUG', ...args),
		error: (...args) => [DEBUG, INFO, WARNING, ERROR].includes(this.getLevel()) && console.error('ERROR', ...args),
		warning: (...args) => [DEBUG, INFO, WARNING].includes(this.getLevel()) && console.warn('WARNING', ...args),
	};

	string = {
		info: (...args) => this.info(`${args.join(' ')}`),
		debug: (...args) => this.debug(`${args.join(' ')}`),
		error: (...args) => this.error(`${args.join(' ')}`),
		warning: (...args) => this.warning(`${args.join(' ')}`),
	};

	object = {
		info: object => this.info(`${JSON.stringify(object, null, 4)}`),
		debug: object => this.debug(`${JSON.stringify(object, null, 4)}`),
		error: object => this.error(`${JSON.stringify(object, null, 4)}`),
		warning: object => this.warning(`${JSON.stringify(object, null, 4)}`),
	};

	redact = (...args) => console.log(...args.map(arg => redactCommon(arg)));
}

export {Logger};

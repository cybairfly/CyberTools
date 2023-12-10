import {Log, LEVELS, LEVEL_TO_STRING} from '@apify/log';
import colors from 'ansi-colors';
import {redact, redactCommon} from 'cyber-tools';

import {LEVEL_TO_COLOR} from './consts.js';
import {CustomLoggers, Reducers, extendDefaultLoggers, getLevels} from './tools.js';

const levels = getLevels(LEVEL_TO_STRING);

class Logue extends Log {
	#redactor = redactCommon;

	#reducers;

	/**
     * Logger extended with additional features for easier formatting and redacting of sensitive
     * inputs. Provide custom redactor to customize redacting behavior. All logs are redacted to
     * conceal common sensitive properties by default if no redactor is provided in options.
     * @param {Partial<import('@apify/log').LoggerOptions> & { redactor: typeof redact | null }} options
     */
	constructor(options = {}) {
		super(options);
		this.#redactor = options.redactor === null ? null : this.#redactor;
		this.#reducers = Reducers(this.#redactor);

		const defaultReducer = this.#redactor ?
			[this.#reducers.redact, this.#reducers.custom] :
			[this.#reducers.custom];

		const customDefaultLoggers = CustomLoggers(levels)(this, defaultReducer);
		extendDefaultLoggers(levels)(this, customDefaultLoggers);

		this.format = CustomLoggers(levels)(this, [this.#reducers.redact, this.#reducers.format]);

		this.redact = {
			...CustomLoggers(levels)(this, [this.#reducers.redact]),
			format: CustomLoggers(levels)(this, [this.#reducers.redact, this.#reducers.format]),
		};
	}

	child(options) {
		let {prefix} = this.options;
		if (options.prefix)
			prefix = prefix ? `${prefix}: ${options.prefix}` : options.prefix;

		const data = options.data ? {...this.options.data, ...options.data} : this.options.data;
		const newOptions = {
			...this.options,
			...options,
			prefix,
			data,
		};

		return new Logue(newOptions);
	}

	/**
     * Bypass logger but respect levels and namespaces
     * @returns {Partial<Logue>}
     */
	bypass = {
		info: (...args) => this.getLevel() >= LEVELS.INFO && (console.log(`${colors[LEVEL_TO_COLOR[LEVELS.INFO]]('INFO ')} ${colors.yellow(this.options.prefix)}:`, ...args)),
		debug: (...args) => this.getLevel() >= LEVELS.DEBUG && (console.debug(`${colors[LEVEL_TO_COLOR[LEVELS.DEBUG]]('DEBUG')} ${colors.yellow(this.options.prefix)}:`, ...args)),
		error: (...args) => this.getLevel() >= LEVELS.ERROR && (console.error(`${colors[LEVEL_TO_COLOR[LEVELS.ERROR]]('ERROR')} ${colors.yellow(this.options.prefix)}:`, ...args)),
		warning: (...args) => this.getLevel() >= LEVELS.WARNING && (console.warn(`${colors[LEVEL_TO_COLOR[LEVELS.WARNING]]('WARN ')} ${colors.yellow(this.options.prefix)}:`, ...args)),
	};

	// object = {
	// 	info: object => this.bypass.info(object),
	// 	debug: object => this.bypass.debug(object),
	// 	error: object => this.bypass.error(object),
	// 	warning: object => this.bypass.warning(object),
	// };

	/**
     * Multi-line stringified format for structured inputs
     * @type {Partial<Logue>}
     */
	format = {};

	/**
     * Redact sensitive values by key in all objects to arbitrary depth by default including deep
     * arrays. Provide custom redactor to constrain the scope and customize the redacting behavior.
     * @type {Partial<Logue> & {format: Partial<Logue>}}
     */
	redact = {
		format: {},
	};
}

export {Logue};

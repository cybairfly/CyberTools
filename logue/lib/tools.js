export const DefaultLoggers = levels => logger => levels.map(level => logger[level]);
export const CustomLoggers = levels => (logger, reducers = []) => levels.reduce(applyReducers(logger, reducers), {});
export const extendDefaultLoggers = levels => (logger, customLoggers) => levels.forEach(level => logger[level] = customLoggers[level]);

export const Reducers = redactor => ({
	format: (...args) => [`${JSON.stringify(args[0], null, 4)}`],
	redact: (...args) => args.map(arg => redactor ? redactor(arg) : arg),
	custom: (...args) => typeof args[args.length - 1] === 'object' && !Array.isArray(args[args.length - 1]) ?
		[`${args
			.slice(0, -1)
			.map(arg =>
				typeof arg === 'object' ?
					JSON.stringify(arg)
					: arg)
			.join(' ')}`,
		args[args.length - 1],
		] :
		`${args
			.map(arg =>
				typeof arg === 'object' ?
					JSON.stringify(arg) :
					arg)
			.join(' ')}`,
});

export const applyReducers = (logger, reducers = []) => (pool, level) => {
	const levelLogger = logger[level];

	return ({
		...pool,
		[level]: (...args) => {
			const updatedArgs = reducers.reduce((args, next) => next(...args), args);

			return Array.isArray(updatedArgs) ?
				levelLogger?.call(logger, ...updatedArgs) :
				levelLogger?.call(logger, updatedArgs);
		},
	});
};

export const getLevels = levelStrings => levelStrings
	.filter(level => !['OFF', 'SOFT_FAIL'].includes(level))
	.map(level => level.toLowerCase());

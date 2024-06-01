export const sleep = ms => new Promise(ok => setTimeout(ok, ms));

export const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

/**
 * Find and return values matching the search predicate
 * @param {Function} query search predicate
 * @returns {(input: any, options: {flatten: boolean})}
 */
export const search = (query = node => !!node) =>
	/**
	 * @param {any} input arbitrary (structured) input
	 * @param {{flatten: boolean}} options return flat results (flatten original structure)
	 * @returns
	 */
	(input, options = {flatten: false}) =>
		// eslint-disable-next-line no-nested-ternary
		isObject(input) ?
			Object
				.values(input)
				.flatMap(([key, value]) => search(query)(value, options)).filter(value => value) :
			// eslint-disable-next-line no-nested-ternary
			query(input) ? input :
				// eslint-disable-next-line no-nested-ternary
				Array.isArray(input) ?
					options.flatten ?
						input.flatMap(item => search(query)(item, options)).filter(value => value) :
						input.map(item => search(query)(item, options)).filter(value => value) :
					false;

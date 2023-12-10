import {isObject} from '../basic.js';

const redactEngine = props => input => {
	const recurseRedact = ({input, props}) => ({match = false}) => {
		if (Array.isArray(input))
			return input.map(item => recurseRedact({input: item, props})({match: match || false}));

		if (!isObject(input)) {
			if (!match)
				return input;

			const length = input?.length || input?.toString?.().length;
			return length ? '●'.repeat(length) : '<secret>';
		}

		return Object
			.fromEntries(Object
				.entries(input)
				.map(([key, value]) => [
					key,
					recurseRedact({input: value, props})({match: match || (props?.includes(key) ?? true)}),
				]));
	};

	return recurseRedact({input, props})({match: false});
};

export {
	redactEngine,
};

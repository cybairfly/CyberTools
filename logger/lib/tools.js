const deepTransform = (object, transformer, ...args) => {
	Object.keys(object).forEach(key => {
		transformer(object, key, ...args);

		if (object[key] && typeof object[key] === 'object')
			return deepTransform(object[key], transformer, ...args);
	});

	return object;
};

const redactor = (object, key, redactKeys) => {
	if (redactKeys.some(redactKey => key === redactKey))
		object[key] = '<redacted>';
};

const redactObject = (object, transformer = redactor, redactKeys = ['proxyUrl', 'proxyUrls']) =>
	deepTransform(object, transformer, redactKeys);

export {
	deepTransform,
	redactObject,
};

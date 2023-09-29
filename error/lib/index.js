const { CyberError: Error } = require('./error');
const { Errors } = require('./errors');

const errors = new Errors();

module.exports = {
	Error,
	errors,
};

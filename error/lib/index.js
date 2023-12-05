import { CyberError } from './error';
import { Errors } from './errors';

const Error = CyberError;
const errors = new Errors();

module.exports = {
	Error,
	errors,
};

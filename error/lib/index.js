import { CyberError } from './error.js';
import { Errors } from './errors.js';

const Error = CyberError;
const errors = new Errors();

export {
	Error,
	errors,
};

import {TIMEOUTS} from 'cyber-consts';
import {tools} from 'cyber-tools';

const {sleep} = tools;

/**
 * Attempts login with provided details and inputs.
 * Either `predicate` or `selectors.verify` is mandatory to check the login result.
 * @param {Object} options
 * @param {Object} options.page
 * @param {Object} [options.human]
 * @param {Number} [options.timeout = 10 * 1000]
 * @param {Function} [options.predicate]
 * @param {Object} options.selectors
 * @param {String} options.selectors.username
 * @param {String} options.selectors.password
 * @param {String} [options.selectors.submit]
 * @param {String} [options.selectors.verify]
 * @param {String} options.username
 * @param {String} options.password
 * @returns {Promise<any[]>} Returns an array with all promises of performed actions and the login response at first index
 */
export const login = async ({page, human, timeout, predicate, selectors, username, password}) => {
	if (!predicate && !selectors.verify)
		throw Error('Login input missing predicate or selector for login status verification');

	const actor = human || page;
	await page.waitForSelector(selectors.username);
	await actor.fill(selectors.username, username);
	await page.waitForSelector(selectors.password, {timeout: 3 * 1000})
		.catch(async error => {
			console.log('Password field not found. Trying to submit username.');
			await page.keyboard.press('Enter');
			await page.waitForSelector(selectors.password);
		});

	await actor.fill(selectors.password, password);
	await sleep(timeout / 10);
	const promises = [];

	if (predicate) {
		promises.push(page.waitForResponse(predicate, {
			timeout: timeout || TIMEOUTS.ten,
		}));
	}

	if (selectors.verify) {
		promises.push(page.waitForSelector(selectors.verify, {
			timeout: timeout || TIMEOUTS.ten,
		}));
	}

	if (selectors.submit)
		promises.push(page.click(selectors.submit));
	else
		promises.push(page.keyboard.press('Enter'));

	return Promise.all(promises);
};

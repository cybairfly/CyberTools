import {Log} from '@apify/log';

import {trackPointer, sleep} from './tools';

const log = new Log().child({prefix: 'Human'});

/**
 * Enables manual or automated simulation of human behavior in Playwright or Puppeteer {@link Page}.
 * Regular input and interaction methods of these lower level automation libraries are wrapped with
 * randomized delays and intermittent mouse moves to simulate human presense and avoid bot detection.
 *
 * Usage (Apify Robot):
 * Enable option on input and use human in the scope after extracting it from context
 * ```js
 * [task] = ({page, human}) => ({
    * await human.press('Enter');
 * })
 * ```
 *
 * Usage (standalone):
 * ```js
 * const human = new Human(page, [options]);
 * await human.type('#username', 'username');
 * await human.type('#password', 'password');
 * await human.press('Enter').catch(() => human.click('#submit'));
 * ```
 */
class Human {
	#page;

	#move;

	#motion;

	#mouse;

	#keyboard;

	#originalInstance;

	/**
     *
     * @param {object} instance Playwright or Puppeteer page or frame
     * @param {object} options Options setting behavior of the human
     * @param {boolean} options.debug Enable visual pointer tracker
     * @param {boolean} options.motion Enable automated pointer motion
     */
	constructor(instance, options = {}) {
		this.#originalInstance = instance;

		this.#page = instance.page ? instance.page() : instance;
		this.#move = options.motion || options.human?.motion?.enable;

		this.#mouse = this.#page.mouse || this.#page.page().mouse;
		this.#keyboard = this.#page.keyboard || this.#page.page().keyboard;

		this.type = this.#humanize(this.type);
		this.click = this.#humanize(this.click);
		this.point = this.#sleepify(this.point);
		this.press = this.#sleepify(this.press);

		this.type = this.#loggify(this.type, 'type');
		this.click = this.#loggify(this.click, 'click');
		this.press = this.#loggify(this.press, 'press');

		if (this.#move) {
			this.type = this.pauseMotion(this.type);
			this.click = this.pauseMotion(this.click);
		}

		if (options.debug)
			trackPointer(this.#page);

		if (this.#page && this.#move)
			this.startMotion();
	}

	/**
     * Human-like typing simulation using random delay between characters.
     * Humanized version of {@link Page}.type.
     * @param options Identical to {@link Page}.type.
     */
	type = async (selector, text, options) => {
		const characters = text.split('');
		for (const character of characters)
			await this.#originalInstance.type(selector, character, {...options, delay: Math.random() * 250});
	};

	/**
     * Adds random delay to click actions.
     * Humanized version of {@link Page}.click.
     * @param options Identical to {@link Page}.click.
     */
	click = async (selector, options) => this.#originalInstance.click(selector, {
		...options,
		// position: {},
		delay: Math.random() * 500,
	});

	/**
     * Moves the cursor to coordinates on page provided in arguments or to a random location by default.
     */
	point = async (x, y) => this.#mouse.move(x || Math.round(Math.random() * 800), y || Math.round(Math.random() * 800)).catch(error => null);

	/**
     * Performs a single keypress after a random delay.
     * Humanized equivalent of {@link Page}.keyboard.press
     */
	press = async (key, options) => this.#keyboard.press(key, {...options, delay: Math.random() * 500});

	sleep = async (limit = 3) => limit > 100 ?
		sleep(Math.random() * limit) :
		sleep(Math.random() * limit * 1000 + 1000);

	#humanize = action => async (...args) => {
		do await this.point(); while (Math.random() < 0.5);
		return action(...args);
	};

	#sleepify = action => async (...args) => {
		await this.sleep();
		return action(...args);
	};

	#loggify = (action, name) => async (...args) => {
		const logArgs = name === 'type' ?
			JSON.stringify([args[0], '●'.repeat(args[1].length)]) :
			JSON.stringify(args);

		log.info(`${name}: ${logArgs}`);
		return action(...args);
	};

	/**
     * Starts random pointer motion to simulate human presence.
     * Can be stopped manually with {@link Human.stopMotion}
     */
	startMotion = async () => {
		const interval = Math.random() * 500 + 250;
		this.#motion = setInterval(async () => {
			await this.sleep(Math.random() * 500 + interval);
			if (Math.round(Math.random()) % 2)
				this.point().catch(() => { });
		}, interval);
	};

	/**
     * Pauses random pointer motion to prevent interference with other interactions (automatic but can be done manually).
     * Clears the interval set by {@link Human.startMotion}
     */
	pauseMotion = action => async (...args) => {
		if (this.#motion)
			this.stopMotion();

		await action(...args);

		if (this.#move)
			this.startMotion();
	};

	/**
     * Stops random pointer motion/human presence simulation.
     * Clears the interval set by {@link Human.startMotion}
     */
	stopMotion = () => {
		clearInterval(this.#motion);
	};
}

export {Human};

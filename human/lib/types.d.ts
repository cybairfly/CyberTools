import {Page} from '@types/puppeteer';

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
export class Human {
    /**
     *
     * @param page Playwright or Puppeteer page instance
     * @param options.debug Enable visual pointer tracker
     * @param options.motion Enable automated pointer motion
     */
    constructor(page: Page, options: {debug: boolean, motion: boolean})

    /**
     * Human-like typing simulation using random delay between characters.
     * Humanized version of {@link Page}.type.
     * @param options Identical to {@link Page}.type.
     */
    type: (selector: string, text: string, options?: Record<string, unknown>) => Promise<void>

    /**
     * Adds random delay to click actions.
     * Humanized version of {@link Page}.click.
     * @param options Identical to {@link Page}.click.
     */
    click: (selector: string, options?: Record<string, unknown>) => Promise<void>

    /**
     * Moves the cursor to coordinates on page provided in arguments or to a random location by default.
     */
    point: (x?: number, y?: number) => Promise<void>

    /**
     * Performs a single keypress after a random delay.
     * Humanized equivalent of {@link Page}.keyboard.press
     */
    press: (key: string, options?: Record<string, unknown>) => Promise<void>

    /**
     * Returns a promise that resolves after a random amount of time capped by the maximum `limit` in seconds (<100) or milliseconds (>100).
     */
    sleep: (limit: number) => Promise<void>

    /**
     * Starts random pointer motion to simulate human presence.
     * Can be stopped manually with {@link human}.stopMotion`.
     */
    startMotion: () => Promise<void>

    /**
     * Pauses random pointer motion to prevent interference with other interactions (automatic but can be done manually).
     * Clears the interval set by {@link human}.startMotion`.
     */
    pauseMotion: () => Promise<void>

    /**
     * Stops random pointer motion/human presence simulation.
     * Clears the interval set by {@link human}.startMotion`.
     */
    stopMotion: () => Promise<void>
}

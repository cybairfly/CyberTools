import { Space as CyberSpace } from "./index.js";

class Space extends CyberSpace {
    one = {
        one: {
            one: 'one',
            two: 123
        }
    }

    /** @type {{ one: { one: { one: string; two: number; } } }} */
    three;
}

export { Space }
import { Space as CyberSpace } from "./index.js";

class Space extends CyberSpace {
    one = {
        one: {
            one: 'one',
            two: Space.secret
        }
    }

    /** @type {{ one: { one: { one: string; two: number; } } }} */
    three;

    secrets() {
        return this[Space.secrets];
    }
}

export { Space }
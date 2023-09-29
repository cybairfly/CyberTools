import { CyberSpace as Space } from "./index.js";

class CyberSpace extends Space {
    one = {
        one: {
            one: 'one',
            two: 123
        }
    }

    /** @type {{ one: { one: { one: string; two: number; } } }} */
    three;
}

export { CyberSpace }
import { Space } from "./index.js";

class CyberSpace extends Space {
    state = {
        one: {
            one: {
                one: 'one',
                two: 123
            }
        },
        two: Number()
    };

    /** @type {{ one: { one: { one: string; two: number; } } }} */
    three;
}

export { CyberSpace }
import { CyberSpace } from "./space.js";

class Class {

    /**
     * 
     * @param {CyberSpace} space 
     */
    constructor(space) {
        this.space = space;
    }

    method({ space } = this) {
        const input = { test: 123 };
        // this.space.store({ input });
        // console.log(this.space.state);

        // console.log(state);
        // this.space.store({ testing: 321 });
        // space.store({ test: 909 })
        space.two = 321;
        delete space.two;
        // space.one = { b: 3 }
        space.one.one = {
            ble: new (class {
                test= 4321
                me () {
                    this.test = 321
                }
            })
        }
        space.one.one.zero = 0;
        // space.meh = 14;
        space.one.one.ble.me();

        space.one = {
            ...space.one,
            two: 909
        }
        // console.log(this.space.state);
        // console.log(this.space.state);
    }
}

const space = new CyberSpace();
const thing = new Class(space);

thing.method();
import { CyberSpace } from ".";

class Class {

    /**
     * 
     * @param {CyberSpace} space 
     */
    constructor(space) {
        this.space = space;
    }

    method({ state } = this.space) {
        const input = { test: 123 };
        this.space.store({ input });
        // console.log(this.space.state);
        this.space.store({ one: { one: { one: 321 } } });
        // console.log(state);
        this.space.store({ testing: 321 });
        space.store({ test: 909 })
        state.one.one.two = 321;
        // console.log(this.space.state);
        // console.log(this.space.state);
    }
}

const space = new HyperSpace();
const thing = new Class(space);

thing.method();
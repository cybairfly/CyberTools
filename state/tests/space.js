import { State } from '../lib/index.js';

class Space extends State {
	one = {
		a: {
			b: {
				c: {
					number: 1,
					string: 'one',
					null: null,
					boolean: true,
					array: [1, 2, 3],
					arrow: () => { console.log('arrow', this); },
					method() { console.log('method', this); },
				},
			},
		},
	};

	bypass = {
		a: {
			b: {
				c: {
					number: 1,
					string: 'one',
					null: null,
					boolean: true,
					array: [1, 2, 3],
				},
			},
		},
	};

	// bypass = new State.Input(this.bypass, {
	//     bypass: true,
	//     // secret: true,
	//     // redact: true,
	//     // strict: true,
	//     // delete: true
	// })

	secret = {
		a: {
			b: {
				c: {
					number: 1,
					string: 'one',
					null: null,
					boolean: true,
					array: [1, 2, 3],
				},
			},
		},
	};

	// secret = new State.Input(this.secret, {
	//     // bypass: true,
	//     secret: true,
	//     // redact: true,
	//     // strict: true,
	//     // delete: true
	// })

	redact = {
		a: {
			b: {
				c: {
					number: 1,
					string: 'one',
					null: null,
					boolean: true,
					array: [1, 2, 3],
				},
			},
		},
	};

	// redact = new State.Input(this.redact, {
	//     // bypass: true,
	//     // secret: true,
	//     redact: true,
	//     // strict: true,
	//     // delete: true
	// })

	strict = {
		a: {
			b: {
				c: {
					number: 1,
					string: 'one',
					null: null,
					boolean: true,
					array: [1, 2, 3],
				},
			},
		},
	};

	// strict = new State.Input(this.strict, {
	//     // bypass: true,
	//     // secret: true,
	//     // redact: true,
	//     strict: true,
	//     // delete: true
	// })

	delete = {
		a: {
			b: {
				c: {
					number: 1,
					string: 'one',
					null: null,
					boolean: true,
					array: [1, 2, 3],
				},
			},
		},
	};

	// delete = new State.Input(this.delete, {
	//     // bypass: true,
	//     // secret: true,
	//     // redact: true,
	//     // strict: true,
	//     delete: true
	// })
}

const space = new Space();

space.bypass = new State.Input(space.bypass, {
	bypass: true,
	// secret: true,
	// redact: true,
	// strict: true,
	// delete: true
});

space.secret = new State.Input(space.secret, {
	// bypass: true,
	secret: true,
	// redact: true,
	// strict: true,
	// delete: true
});

space.redact = new State.Input(space.redact, {
	// bypass: true,
	// secret: true,
	redact: true,
	// strict: true,
	// delete: true
});

space.strict = new State.Input(space.strict, {
	// bypass: true,
	// secret: true,
	// redact: true,
	strict: true,
	// delete: true
});

space.delete = new State.Input(space.delete, {
	// bypass: true,
	// secret: true,
	// redact: true,
	// strict: true,
	delete: true,
});

// TODO init special inputs separately?
// Space.start(space);

export { Space, space };

// const space = new Space();
// console.log(space.redact.a.b.c);
// console.log(space.strict.a.b.c);
// space.redact.a.b.c = 2
// space.redact = {a:2}
// console.log(space.redact);

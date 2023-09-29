import { State as CyberSpace } from './index.js';

class Space extends CyberSpace {
	one = {
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

	two = {
		x: {
			y: {
				z: {
					number: 2,
					string: 'two',
					null: null,
					boolean: false,
					array: [2, 3, 4],
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

	bypass = new CyberSpace.Input(this.bypass, {
		bypass: true,
		// secret: true,
		// redact: true,
		// strict: true,
		// delete: true
	});

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

	secret = new CyberSpace.Input(this.secret, {
		// bypass: true,
		secret: true,
		// redact: true,
		// strict: true,
		// delete: true
	});

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

	redact = new CyberSpace.Input(this.redact, {
		// bypass: true,
		// secret: true,
		redact: true,
		// strict: true,
		// delete: true
	});

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

	strict = new CyberSpace.Input(this.strict, {
		// bypass: true,
		// secret: true,
		// redact: true,
		strict: true,
		// delete: true
	});

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

	delete = new CyberSpace.Input(this.delete, {
		// bypass: true,
		// secret: true,
		// redact: true,
		// strict: true,
		delete: true,
	});
}

export { Space };

// const space = new Space();
// console.log(space.redact.a.b.c);
// console.log(space.strict.a.b.c);
// space.redact.a.b.c = 2
// space.redact = {a:2}
// console.log(space.redact);

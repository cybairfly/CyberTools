/* eslint-disable max-classes-per-file */
import { Space } from './space.js';

class Class {
	/**
     *
     * @param {Space} space
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
		//  delete space.two;
		// space.one = { b: 3 }

		console.log('bypass');
		space._test = new Space.Input({ a: { b: { c: 4 }, more: { z: 123 }, zero: [1, 2, 3] } }, { bypass: false, secret: true, redact: true, strict: false, delete: true });
		delete space._test;
		space._test = new Space.Input({ a: { b: { c: 4 }, more: { z: 123 }, zero: [1, 2, 3] } }, { bypass: true, redact: true, secret: true, strict: true, delete: true });
		space._test = {a: 1};
		// space._test = 123;
		space._test = { ...space._test, b: 2 };
		space._test = { a: 1 };
		space._test.a = {b: {c: 1}};
		space._test = {a: {b: {c: 5}}};
		space._test.a.b.c = 3;
		space._test.a.b = 2;
		space._test.a = 1;
		space._test = 0;
		// delete space._test;

		console.log('secret');
		space._test = new Space.Input({ a: { b: { c: 4 }, more: { z: 123 }, zero: [1, 2, 3] } }, { bypass: false, secret: false, redact: false, strict: false, delete: true });
		delete space._test;
		space._test = new Space.Input({ a: { b: { c: 4 }, more: { z: 123 }, zero: [1, 2, 3] } }, { bypass: false, secret: true, redact: false, strict: false, delete: true });
		space._test = {a: 1};
		// space._test = 123;
		space._test = { ...space._test, b: 2 };
		space._test = { a: 1 };
		space._test.a = {b: {c: 1}};
		space._test = {a: {b: {c: 5}}};
		space._test.a.b.c = 3;
		space._test.a.b = 2;
		space._test.a = 1;
		space._test = 0;
		delete space._test;

		console.log('redact');
		space._test = new Space.Input({ a: { b: { c: 4 }, more: { z: 123 }, zero: [1, 2, 3] } }, { bypass: false, secret: true, redact: false, strict: false, delete: true });
		delete space._test.a.b.c;
		space._test = new Space.Input({ a: { b: { c: 4 }, more: { z: 123 }, zero: [1, 2, 3] } }, { bypass: false, secret: false, redact: true, strict: false, delete: true });
		space._test = {a: 1};
		// space._test = 123;
		space._test = { ...space._test, b: 2 };
		space._test = { a: 1 };
		space._test.a = {b: {c: 1}};
		space._test = {a: {b: {c: 5}}};
		space._test.a.b.c = 3;
		space._test.a.b = 2;
		space._test.a = 1;
		space._test = 0;
		delete space._test;

		console.log('strict');
		space._test = new Space.Input({ a: { b: { c: 4 }, more: { z: 123 }, zero: [1, 2, 3] } }, { bypass: false, redact: true, secret: false, strict: false, delete: true });
		delete space._test.a.b.c;
		space._test = new Space.Input({ a: { b: { c: 4 }, more: { z: 123 }, zero: [1, 2, 3] } }, { bypass: false, redact: false, secret: false, strict: true, delete: true });
		space._test = {a: 1};
		space._test = { ...space._test, b: 2 };
		// space._test = { a: 1 };
		// space._test.a = {b: {c: 1}};
		space._test = {a: {b: {c: 5}}};
		space._test.a.b.c = 3;
		// space._test.a.b = 2;
		// space._test.a = 1;
		delete space._test;
		space._test = {a: {b: {c: 5}}};
		space._test = 0;

		space._test = {a: {b: {c: 5}}};
		space._test.a.b.c = 3;
		space._test.a.b = 2;
		space._test.a = 1;
		space._test = 0;
		// delete space._test;
		space.one.one.two = 123;
		space.one.one = {
			ble: new (class {
				test = 4321;

				me() {
					this.test = 321;
				}
			})(),
		};

		space.one.one.zero = 0;
		// space.meh = 14;
		space.one.one.ble.me();

		space.one = {
			...space.one,
			two: 909,
		};

		space._test = new Space.Input({ a: { b: { c: 4 }, more: { z: 123 }, zero: [1, 2, 3] } }, { bypass: false, redact: false, secret: false, strict: false, delete: true });
		space._test = {a: 1};
		space._test = { ...space._test, b: 2 };
		// space._test = { a: 1 };
		// space._test.a = {b: {c: 1}};
		space._test = {a: {b: {c: 5}}};
		space._test.a.b.c = 3;
		// space._test.a.b = 2;
		// space._test.a = 1;
		delete space._test;
		space._test = {a: {b: {c: 5}}};
		space._test = 0;

		space._test = {a: {b: {c: 5}}};
		space._test.a.b.c = 3;
		space._test.a.b = 2;
		space._test.a = 1;
		space._test = 0;
		// delete space._test;
		space.one.one.two = 123;
		space.one.one = {
			ble: new (class {
				test = 4321;

				me() {
					this.test = 321;
				}
			})(),
		};

		space.one.one.zero = 0;
		// space.meh = 14;
		space.one.one.ble.me();

		space.one = {
			...space.one,
			two: 909,
		};
	}
}

const space = new Space();
const thing = new Class(space);

thing.method();

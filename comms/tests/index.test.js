import { test } from 'vitest';

import { comms } from '../lib/index.js';

test('basic', async () => {
	const input = {
		message: 'hi',
		channel: 'test',
	};

	const {message, channel} = input;
	await comms.cast({message, channel, options: {title: 'test', tags: ['one', 'two'], priority: 5}});

	// await new Comms.services.Mail({recipients: ['icode@email.cz']}).send({message: 'test', channel: 'test'});
});

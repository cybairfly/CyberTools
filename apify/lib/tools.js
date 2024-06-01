export const checkActorItemsLimit = count => {
	const limit = process.env.ACTOR_MAX_PAID_DATASET_ITEMS;
	if (count > limit) {
		console.log('Limit exceeded for ACTOR_MAX_PAID_DATASET_ITEMS. Terminating.');
		process.exit();
	}
};

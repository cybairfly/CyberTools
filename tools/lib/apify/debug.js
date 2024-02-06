/**
 *
 * @param {types.page} page
 * @param {{name: string}} param
 * @returns
 */
export const debug = async (page, {name}) => {
	console.log(' '.repeat(100));
	console.log(`DEBUG [${name || 'auto'}]`);
	console.log('-'.repeat(100));
	await saveScreenshot(page, {name: `DEBUG${name ? `-${name}` : ''}`});
	await savePageContent(page, {name: `DEBUG${name ? `-${name}` : ''}`});
};

/**
 *
 * @param {types.page} page
 * @param {{name: string, inputId?: string, store?: KeyValueStore}} param0
 * @returns
 */
export const saveScreenshot = async (page, {name, inputId, store = KeyValueStore}) => {
	try {
		await page.waitForFunction(() => document.readyState !== 'loading').catch(() => null);
		const buffer = await page.screenshot({type: 'jpeg', quality: 70, fullPage: true});
		const fileName = `PAGE-SNAP-${name || 'AUTO'}-${inputId || Date.now()}`;
		await store.setValue(fileName, buffer, {contentType: 'image/png'});
		const storeId = process.env.APIFY_DEFAULT_KEY_VALUE_STORE_ID;

		return `https://api.apify.com/v2/key-value-stores/${storeId}/records/${fileName}`;
	} catch (error) {
		console.warning('Failed to take a screenshot');
		console.error(error.message, error);
	}
};

/**
 *
 * @param {types.page} page
 * @param {{name: string, inputId?: string, store?: KeyValueStore}} param0
 * @returns
 */
export const savePageContent = async (page, {name, inputId, store = KeyValueStore}) => {
	try {
		const fileName = `PAGE-HTML-${name || 'AUTO'}-${inputId || Date.now()}`;
		await store.setValue(fileName, await page.content(), {contentType: 'text/html'});
		const storeId = process.env.APIFY_DEFAULT_KEY_VALUE_STORE_ID;

		return `https://api.apify.com/v2/key-value-stores/${storeId}/records/${fileName}`;
	} catch (error) {
		console.warning('Failed to capture page content');
		console.error(error.message, error);
	}
};

export const trimUrl = url => url.startsWith('data:') ? url.substring(0, url.indexOf(';')) : urlParamsToEllipsis(url);

export const urlParamsToEllipsis = url => {
	const urlCutOffIndex = url.indexOf('?') + 1;
	return urlCutOffIndex ? `${url.slice(0, urlCutOffIndex)}...` : url;
};

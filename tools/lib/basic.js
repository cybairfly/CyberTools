export const sleep = ms => new Promise(ok => setTimeout(ok, ms));

export const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

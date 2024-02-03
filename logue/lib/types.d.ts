import {Log} from '@apify/log';

const loggerModel = new Log();
export type logger = typeof loggerModel;

export as namespace types;
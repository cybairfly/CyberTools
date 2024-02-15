import type { Page } from 'playwright'
import type { Cookie, Dataset, Request, PlaywrightCrawler } from 'crawlee'
import { models } from './models/index.js'

export type page = Page;
export type crawler = PlaywrightCrawler;
export type request = Request;

export type datasets = {
	default: object,
	records: object
}

export type scraper =
	Partial<typeof models.scraper> &
	{ selectors: typeof models.scraper.selectors } &
	{ extractor: typeof models.scraper.extractor }

export type scrapers = {
	[key: string]: scrapers | scraper
}

export type selector = typeof models.selector
export type selectors = Array<selector>

export type actorInput = input & { filters: string } & { scrapers: string }

export type input =
	Partial<typeof models.input> &
	typeof models.force.input &
	({ config: typeof models.input.config } | { url: typeof models.input.url }) &
	{ filters: Array<Function> } &
	{ scrapers: scrapers } &
	{ cookies?: Cookie }

	type RecursivePartial<T> = {
		[P in keyof T]?: T[P] extends object ? RecursivePartial<T[P]> : T[P];
	  };
	  
export type config =
	Partial<typeof models.config> &
	{ url: typeof models.config.url } &
	({ login?: Partial<typeof models.config.login> }) &
	({ scrapers: scrapers })

export type configs = Array<config>

// export type state = typeof models.state & {dataset: Dataset}

export type state = {
	page: Page,
	input: input!,
	config: config!,
	watcher: Watcher,
	records: Array<Object>,
	datasets: {
		default: Dataset,
		records: Dataset,
	},
	scrapers: Array<scraper>,
	selectors: selectors,
}

export as namespace WatcherTypes;

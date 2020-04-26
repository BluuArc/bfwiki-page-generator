export const SERVER_NAME_MAPPING = Object.freeze({
	EU: 'Europe',
	Europe: 'EU',
	GL: 'Global',
	Global: 'GL',
	JP: 'Japan',
	Japan: 'JP',
});

export const SERVERS = Object.freeze([
	SERVER_NAME_MAPPING.Global,
	SERVER_NAME_MAPPING.Europe,
	SERVER_NAME_MAPPING.Japan,
]);

export const DATA_MAPPING = Object.freeze({
	bursts: {
		files: new Array(10).fill(0).map((_, i) => `bbs_${i}.json`),
		key: 'bursts',
		name: 'Brave Bursts',
	},
	dictionary: {
		files: ['dictionary.json'],
		key: 'dictionary',
		name: 'Dictionary',
	},
	evolutionMaterials: {
		files: ['evo_list.json'],
		key: 'evolutionMaterials',
		name: 'Evolution Materials',
	},
	extraSkills: {
		files: ['es.json'],
		key: 'extraSkills',
		name: 'Extra Skills',
	},
	items: {
		files: ['items.json'],
		key: 'items',
		name: 'Items',
	},
	leaderSkills: {
		files: ['ls.json'],
		key: 'leaderSkills',
		name: 'Leader Skills',
	},
	missions: {
		files: ['missions.json'],
		key: 'missions',
		name: 'Missions',
	},
	spEnhancements: {
		files: ['feskills.json'],
		key: 'spEnhancements',
		name: 'SP Enhancements',
	},
	units: {
		files: ['info.json'],
		key: 'units',
		name: 'Units',
	},
});

export const EXPECTED_TABLE_MAPPING = Object.freeze({
	[DATA_MAPPING.bursts.key]: [
		DATA_MAPPING.bursts.key,
		DATA_MAPPING.units.key,
	],
	[DATA_MAPPING.extraSkills.key]: [
		DATA_MAPPING.extraSkills.key,
	],
	[DATA_MAPPING.items.key]: [
		DATA_MAPPING.items.key,
		DATA_MAPPING.dictionary.key,
	],
	[DATA_MAPPING.units.key]: [
		// TODO: update with items and uncomment when parsing ES is implemented
		DATA_MAPPING.units.key,
		DATA_MAPPING.spEnhancements.key,
		DATA_MAPPING.dictionary.key,
		DATA_MAPPING.evolutionMaterials.key,
	],
});

export const SETTING_KEYS = Object.freeze({
	BASE_CONTENT_URL: 'url-',
	DEBUG_MODE: 'debugMode',
	DEFAULT_SERVER: 'defaultServer',
	USE_LIGHT_THEME: 'useLightTheme',
});

export const BASE_DATAMINE_URL = 'https://raw.githubusercontent.com/cheahjs/bravefrontier_data/master';

export const DEFAULT_CONTENT_URLS = Object.freeze({
	EU: 'http://static-bravefrontier.gumi-europe.net/content',
	GL: 'https://dv5bk1m8igv7v.cloudfront.net/asset/21300/content',
	JP: 'http://cdn.android.brave.a-lim.jp',
});

export const DEFAULT_TAB_NAMES = Object.freeze({
	JSON_EXPLORER: 'JSON Explorer',
	WIKI_TEMPLATE: 'Wiki Template',
});

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

export const SETTING_KEYS = Object.freeze({
	DEFAULT_SERVER: 'defaultServer',
	USE_LIGHT_THEME: 'useLightTheme',
});

export const BASE_DATAMINE_URL = 'https://raw.githubusercontent.com/cheahjs/bravefrontier_data/master';

export const ELEMENTS = Object.freeze(['fire', 'water', 'earth', 'thunder', 'light', 'dark']);

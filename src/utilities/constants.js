export const SERVERS = Object.freeze(['GL', 'EU', 'JP']);

export const SERVER_NAME_MAPPING = Object.freeze({
	EU: 'Europe',
	Europe: 'EU',
	GL: 'Global',
	Global: 'GL',
	JP: 'Japan',
	Japan: 'JP',
});

export const DATA_MAPPING = Object.freeze({
	bursts: {
		files: new Array(10).fill(0).map((_, i) => `bbs_${i}.json`),
		name: 'Brave Bursts',
	},
	dictionary: {
		files: ['dictionary.json'],
		name: 'Dictionary',
	},
	evolutionMaterials: {
		files: ['evo_list.json'],
		name: 'Evolution Materials',
	},
	extraSkills: {
		files: ['es.json'],
		name: 'Extra Skills',
	},
	items: {
		files: ['items.json'],
		name: 'Items',
	},
	leaderSkills: {
		files: ['ls.json'],
		name: 'Leader Skills',
	},
	missions: {
		files: ['missions.json'],
		name: 'Missions',
	},
	spEnhancements: {
		files: ['feskills.json'],
		name: 'SP Enhancements',
	},
	units: {
		files: ['info.json'],
		name: 'Units',
	},
});

export const SETTING_KEYS = Object.freeze({
	DEFAULT_SERVER: 'defaultServer',
	USE_LIGHT_THEME: 'useLightTheme',
});

export const BASE_DATAMINE_URL = 'https://raw.githubusercontent.com/cheahjs/bravefrontier_data/master';

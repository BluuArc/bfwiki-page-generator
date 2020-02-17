import { SpCategoryName } from '@bluuarc/bfmt-utilities/dist/datamine-types';

export const ELEMENT_NAME_MAPPING = Object.freeze({
	dark: 'Dark',
	earth: 'Earth',
	fire: 'Fire',
	light: 'Light',
	thunder: 'Thunder',
});

export const MAX_LEVEL_MAPPING = {
	2: 30,
	3: 40,
	4: 60,
	5: 80,
	6: 100,
	7: 120,
	8: 150,
};

// TODO: replace with bfmt-utilities method
export const SP_CATEGORY_MAPPING = Object.freeze({
	1: SpCategoryName['Parameter Boost'],
	2: SpCategoryName.Spark,
	3: SpCategoryName['Critical Hits'],
	4: SpCategoryName['Attack Boost'],
	5: SpCategoryName['BB Gauge'],
	6: SpCategoryName['HP Recovery'],
	7: SpCategoryName.Drops,
	8: SpCategoryName['Ailment Resistance'],
	9: SpCategoryName['Ailment Infliction'],
	10: SpCategoryName['Damage Reduction'], // eslint-disable-line sort-keys
	11: SpCategoryName.Special,
});

export const ITEM_TYPES_MAPPING = Object.freeze({
	CONSUMABLE: 'consumable',
	EVOLUTION_MATERIAL: 'evomat',
	LS_SPHERE: 'ls_sphere',
	MATERIAL: 'material',
	RAID: 'raid',
	SPHERE: 'sphere',
	SUMMONER_CONSUMABLE: 'summoner_consumable',
});

export const ITEM_TYPES_NAMES_MAPPING = Object.freeze({
	[ITEM_TYPES_MAPPING.CONSUMABLE]: 'Consumable',
	[ITEM_TYPES_MAPPING.EVOLUTION_MATERIAL]: 'Evolution Material',
	[ITEM_TYPES_MAPPING.LS_SPHERE]: 'LS Sphere',
	[ITEM_TYPES_MAPPING.MATERIAL]: 'Material',
	[ITEM_TYPES_MAPPING.RAID]: 'Raid',
	[ITEM_TYPES_MAPPING.SPHERE]: 'Sphere',
	[ITEM_TYPES_MAPPING.SUMMONER_CONSUMABLE]: 'Summoner Consumable',
});

export const ITEM_TYPES = Object.freeze([
	ITEM_TYPES_MAPPING.CONSUMABLE,
	ITEM_TYPES_MAPPING.EVOLUTION_MATERIAL,
	ITEM_TYPES_MAPPING.LS_SPHERE,
	ITEM_TYPES_MAPPING.MATERIAL,
	ITEM_TYPES_MAPPING.RAID,
	ITEM_TYPES_MAPPING.SPHERE,
	ITEM_TYPES_MAPPING.SUMMONER_CONSUMABLE,
]);

export const ELEMENTS = Object.freeze(['fire', 'water', 'earth', 'thunder', 'light', 'dark']);

export const SPHERE_TYPE_MAPPING = Object.freeze({
	0: 'None',
	1: 'Status Enhancing',
	2: 'Critical',
	3: 'Drop',
	4: 'Ailment Inducing',
	5: 'Element Fusion',
	6: 'BB Gauge',
	7: 'HP Recovery',
	8: 'Target Setting',
	9: 'Damage Deflecting',
	10: 'Damage Reducing', // eslint-disable-line sort-keys
	11: 'Spark',
	12: 'Defense Piercing',
	13: 'Attack Boosting',
	14: 'Special',
});

export const TARGET_AREA_MAPPING = Object.freeze({
	aoe: 'AOE',
	random: 'RT',
	single: 'ST',
});

export const BURST_TYPE_MAPPING = Object.freeze({
	BB: 'bb',
	SBB: 'sbb',
	UBB: 'ubb',
	bb: 'BB',
	sbb: 'SBB',
	ubb: 'UBB',
});

export const BURST_TYPES = Object.freeze([
	BURST_TYPE_MAPPING.BB,
	BURST_TYPE_MAPPING.SBB,
	BURST_TYPE_MAPPING.UBB,
]);

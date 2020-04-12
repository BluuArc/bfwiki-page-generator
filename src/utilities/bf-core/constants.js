export const ELEMENT_NAME_MAPPING = Object.freeze({
	dark: 'Dark',
	earth: 'Earth',
	fire: 'Fire',
	light: 'Light',
	thunder: 'Thunder',
	water: 'Water',
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

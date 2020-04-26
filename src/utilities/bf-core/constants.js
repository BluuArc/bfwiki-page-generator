import { ArenaCondition } from '@bluuarc/bfmt-utilities/dist/datamine-types';

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

/**
 * @type {{ [id: string]: import('@bluuarc/bfmt-utilities/dist/datamine-types').IUnitArenaAiEntry}}
 */
export const ARENA_ENTRIES_BY_TYPE = (() => {
	/**
	 * @param {'attack'|'skill'} action
	 * @param {number} chance
	 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').ArenaCondition} condition
	 * @param {'party'|'enemy'} target
	 * @returns {import('@bluuarc/bfmt-utilities/dist/datamine-types').IUnitArenaAiEntry}
	 */
	const createArenaEntry = (action, chance, condition, target) => ({
		action,
		'chance%': chance,
		'target conditions': condition,
		'target type': target,
	});
	const SKILL_ACTION = 'skill';
	const ATTACK_ACTION = 'attack';
	const PARTY_TARGET = 'party';
	const ENEMY_TARGET = 'enemy';
	return Object.freeze({
		1: [
			createArenaEntry(SKILL_ACTION, 60, ArenaCondition.random, PARTY_TARGET),
			createArenaEntry(ATTACK_ACTION, 30, ArenaCondition.atk_max, ENEMY_TARGET),
			createArenaEntry(ATTACK_ACTION, 100, ArenaCondition.random, ENEMY_TARGET),
		],
		2: [
			createArenaEntry(SKILL_ACTION, 60, ArenaCondition.hp_50pr_over, ENEMY_TARGET),
			createArenaEntry(SKILL_ACTION, 20, ArenaCondition.random, ENEMY_TARGET),
			createArenaEntry(ATTACK_ACTION, 100, ArenaCondition.random, ENEMY_TARGET),
		],
		3: [
			createArenaEntry(SKILL_ACTION, 60, ArenaCondition.random, ENEMY_TARGET),
			createArenaEntry(SKILL_ACTION, 20, ArenaCondition.atk_max, ENEMY_TARGET),
			createArenaEntry(ATTACK_ACTION, 30, ArenaCondition.hp_min, ENEMY_TARGET),
			createArenaEntry(ATTACK_ACTION, 100, ArenaCondition.random, ENEMY_TARGET),
		],
		4: [
			createArenaEntry(SKILL_ACTION, 60, ArenaCondition.hp_50pr_under, ENEMY_TARGET),
			createArenaEntry(SKILL_ACTION, 30, ArenaCondition.random, ENEMY_TARGET),
			createArenaEntry(ATTACK_ACTION, 70, ArenaCondition.hp_max, ENEMY_TARGET),
			createArenaEntry(ATTACK_ACTION, 50, ArenaCondition.hp_min, ENEMY_TARGET),
			createArenaEntry(ATTACK_ACTION, 100, ArenaCondition.random, ENEMY_TARGET),
		],
		5: [
			createArenaEntry(SKILL_ACTION, 80, ArenaCondition.hp_50pr_over, PARTY_TARGET),
			createArenaEntry(SKILL_ACTION, 20, ArenaCondition.hp_min, PARTY_TARGET),
			createArenaEntry(ATTACK_ACTION, 100, ArenaCondition.random, ENEMY_TARGET),
		],
		6: [
			createArenaEntry(SKILL_ACTION, 100, ArenaCondition.hp_25pr_under, PARTY_TARGET),
			createArenaEntry(ATTACK_ACTION, 50, ArenaCondition.atk_max, ENEMY_TARGET),
			createArenaEntry(ATTACK_ACTION, 100, ArenaCondition.random, ENEMY_TARGET),
		],
		7: [
			createArenaEntry(SKILL_ACTION, 100, ArenaCondition.hp_75pr_under, PARTY_TARGET),
			createArenaEntry(ATTACK_ACTION, 50, ArenaCondition.hp_min, ENEMY_TARGET),
			createArenaEntry(ATTACK_ACTION, 100, ArenaCondition.random, ENEMY_TARGET),
		],
		// NOTE: not in Deathmax data: types 8 - 13
	});
})();

import {
	ARENA_ENTRIES_BY_TYPE,
	ELEMENT_NAME_MAPPING,
	MAX_LEVEL_MAPPING,
} from '@/utilities/bf-core/constants';
import {
	DATA_MAPPING,
	SERVER_NAME_MAPPING,
} from '@/utilities/constants';
import {
	extractAttackingDamageFrames,
	getAttackingEffectsForEffectsList,
	getBurstLevelEntry,
	getExtraAttackFrames,
} from '@/utilities/bf-core/bursts';
import {
	generateDbbData,
	getDamageFrames,
	getSynergyData,
} from './bursts';
import {
	generateRarityString,
	generateTemplateBody,
} from './utils';
import {
	getSpCategoryName,
	spCodeToIndex,
} from '@bluuarc/bfmt-utilities/dist/sp-enhancements';
import {
	getSpCost,
	getSpDependencyText,
	getSpDescription,
} from '@/utilities/bf-core/spEnhancements';
import { TargetArea } from '@bluuarc/bfmt-utilities/dist/datamine-types';
import appLocalStorageStore from '@/utilities/AppLocalStorageStore';
import bfDatabase from '@/utilities/BfDatabase/index.client';
import { getEffectId } from '@bluuarc/bfmt-utilities/dist/buffs';
import { getEvolutions } from '@/utilities/bf-core/units';
import getLogger from '@/utilities/Logger';
import { getNumberOrDefault } from '@/utilities/utils';

const logger = getLogger('generateUnitTemplate');

// TODO: things to support
/**
 * deep parsing of BB/SBB/UBB/LS/ES
 * condition parsing of ES
 */

/**
 * @typedef WikiDamageFramesEntry
 * @property {string} WikiDamageFramesEntry.distribute
 * @property {string} WikiDamageFramesEntry.effectdelay
 * @property {string} WikiDamageFramesEntry.frames
 * @property {number} WikiDamageFramesEntry.hits
 * @property {number} WikiDamageFramesEntry.totaldistr
 * @property {number} WikiDamageFramesEntry.frameIndex
 * @property {'A' | '1'} WikiDamageFramesEntry.target
 * @property {number} WikiDamageFramesEntry.multiplier
 * @property {boolean} WikiDamageFramesEntry.hpScaled
 */

/**
 * @typedef {{ skills: import('@bluuarc/bfmt-utilities/dist/datamine-types').ISpEnhancementEntry[] }} DatabaseSpEnhancementEntry
 */

/**
 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').UnitAnimationKey} prop
 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').IUnit} unit
 * @returns {number}
 */
function getAnimationForProperty (prop, unit) {
	let result;
	if (unit.animations && unit.animations[prop]) {
		result = unit.animations[prop]['total number of frames'];
	}
	return result;
}

/**
 * @param {'attack'|'skill'} prop
 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').IUnit} unit
 * @returns {{ movespeed: number, movetype: string, speedtype: string }}
 */
function getMoveSpeedForProperty (prop, unit) {
	let result = {};
	if (unit.movement && unit.movement[prop]) {
		const movementEntry = unit.movement[prop];
		result.movespeed = movementEntry['move speed'];
		result.movetype = movementEntry['move type'];
		result.speedtype = movementEntry['move speed type'];
	}
	return result;
}

/**
 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').IUnit} unit
 * @param {DatabaseSpEnhancementEntry} spData
 * @param {string} burstProp
 */
function getExtraAttackInfo (unit, burstProp, spData) {
	// assumption: unit[burstProp] exists
	const extraAttackFrames = getExtraAttackFrames(unit[burstProp]);
	let extraAttacks = [];

	[
		{
			key: 'leader skill',
			name: 'LS',
		},
		{
			key: 'extra skill',
			name: 'ES',
		},
	].forEach(({ key, name }) => {
		if (unit[key]) {
			const attackingEffects = getAttackingEffectsForEffectsList(unit[key].effects, name, () => extraAttackFrames)
				.filter(e => e[burstProp]);
			extraAttacks = extraAttacks.concat(attackingEffects);
		}
	});

	if (spData && spData.skills) {
		const allEffects = spData.skills
			.map(s => s.skill.effects)
			.reduce((acc, effectsArr) => acc.concat(effectsArr), [])
			.filter(s => s.passive)
			.map(s => s.passive);
		const attackingEffects = getAttackingEffectsForEffectsList(allEffects, 'SP', () => extraAttackFrames)
			.filter(e => e[burstProp]);
		extraAttacks = extraAttacks.concat(attackingEffects);
	}

	return {
		extraAttacks: extraAttacks.map(attack => attack.originalEffect),
		frames: extraAttackFrames,
	};
}

/**
 * @param {string} burstProp
 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').IUnit} unit
 * @param {DatabaseSpEnhancementEntry} spData
 * @returns {WikiDamageFramesEntry[]}
 */
function getBurstFrameData (burstProp, unit, spData) {
	/**
	 * @type {WikiDamageFramesEntry[]}
	 */
	let result = [];
	if (unit[burstProp] && unit[burstProp]['damage frames']) {
		const lastLevel = getBurstLevelEntry(unit[burstProp]);
		const attackingFrames = extractAttackingDamageFrames(unit[burstProp]['damage frames']);
		const applyEffectDataToFrame = (frame, correspondingEffect) => {
			frame.target = (correspondingEffect['target area'] === TargetArea.Aoe && !correspondingEffect['random attack']) ? 'A' : '1';
			if (!isNaN(correspondingEffect.hits)) {
				frame.hits = +correspondingEffect.hits;
			}
			frame.multiplier = correspondingEffect['bb atk%'] || correspondingEffect['bb base atk%'];
			frame.hpScaled = correspondingEffect.hasOwnProperty('bb added atk% based on hp');
			frame.sourcePath = correspondingEffect.sourcePath;
			return frame;
		};
		result = attackingFrames.map(getDamageFrames)
			.map(frame => {
				const correspondingEffect = lastLevel.effects[frame.frameIndex];
				return applyEffectDataToFrame(frame, correspondingEffect);
			});

		const extraAttackInfo = getExtraAttackInfo(unit, burstProp, spData);
		result = result.concat(extraAttackInfo.extraAttacks.map(effect => {
			const frameData = {
				...extraAttackInfo.frames,
				'effect delay time(ms)/frame': effect['effect delay time(ms)/frame'],
			};
			return applyEffectDataToFrame(getDamageFrames(frameData), effect);
		}));
	}
	return result;
}

/**
 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').IUnitStatsEntry} stats
 * @param {string} statProp
 * @returns {number}
 */
function getStatEntryOrAverage (stats, statProp) {
	return typeof stats[statProp] !== 'undefined'
		? stats[statProp]
		: Math.floor((stats[`${statProp} max`] + stats[`${statProp} min`]) / 2);
}

/**
 * @param {string} type
 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').IUnit} unit
 * @returns {import('@bluuarc/bfmt-utilities/dist/datamine-types').IUnitStatsEntry}
 */
function getStatEntriesForType (type, unit) {
	const result = {
		atk: 0,
		def: 0,
		hp: 0,
		rec: 0,
	};
	if (unit.stats && unit.stats[type]) {
		const statsForType = unit.stats[type];
		result.hp = getStatEntryOrAverage(statsForType, 'hp');
		result.atk = getStatEntryOrAverage(statsForType, 'atk');
		result.def = getStatEntryOrAverage(statsForType, 'def');
		result.rec = getStatEntryOrAverage(statsForType, 'rec');
	}
	return result;
}

/**
 * @param {string} type
 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').IUnit} unit
 * @param {DatabaseSpEnhancementEntry} spData
 * @returns {{ dc: number, desc: string, gauge: number, name: string, attacks: WikiDamageFramesEntry[], type: "Offense"|"Heal"|"Support" }}
 */
function getBurstInfo (type, unit, spData) {
	const result = {
		attacks: [],
		dc: '',
		desc: '',
		gauge: '',
		name: '',
		type: '',
	};
	if (unit[type]) {
		/**
		 * @type {import('@bluuarc/bfmt-utilities/dist/datamine-types').IBraveBurst}
		 */
		const burstEntry = unit[type];
		result.attacks = getBurstFrameData(type, unit, spData);
		result.name = burstEntry.name;
		result.desc = burstEntry.desc;
		result.dc = burstEntry['drop check count'];
		result.gauge = burstEntry.levels[burstEntry.levels.length - 1]['bc cost'];

		if (result.attacks.length > 0) {
			result.type = 'Offense';
		} else {
			/**
			 * @type {string[]}
			 */
			const presentProcs = burstEntry['damage frames'].map(frame => getEffectId(frame));
			result.type = presentProcs.some(id => +id === 2 || +id === 3) ? 'Heal' : 'Support';
		}
	}
	return result;
}

/**
 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').IUnit} unit
 * @returns {Promise<DatabaseSpEnhancementEntry>}
 */
function getSpData (unit) {
	return bfDatabase.then(worker => worker.getById({
		id: unit.id,
		server: appLocalStorageStore.serverName,
		table: DATA_MAPPING.spEnhancements.key,
	}));
}

/**
 * @param {string|number} id
 * @returns {Promise<import('@bluuarc/bfmt-utilities/dist/datamine-types').IBraveBurst>}
 */
function getBurstData (id) {
	return bfDatabase.then(worker => worker.getById({
		id,
		server: appLocalStorageStore.serverName,
		table: DATA_MAPPING.bursts.key,
	}));
}

/**
 * @param {DatabaseSpEnhancementEntry} spData
 * @returns {import('./utils').WikiDataPair}
 */
async function generateSpData (spData) {
	const result = [];
	if (spData && Array.isArray(spData.skills)) {
		/**
		 * @type {{ [x: string]: import('@bluuarc/bfmt-utilities/dist/datamine-types').ISpEnhancementEntry[] }}
		 */
		const skillsByCategory = spData.skills.reduce((acc, feskillEntry) => {
			if (!acc[feskillEntry.category]) {
				acc[feskillEntry.category] = [];
			}
			acc[feskillEntry.category].push(feskillEntry);
			return acc;
		}, {});
		Object.keys(skillsByCategory)
			.sort((a, b) => +a - +b) // sort by category number
			.forEach((categoryKey, i) => {
				const entries = skillsByCategory[categoryKey];
				const baseKey = `|omniskill${i + 1}_`;
				result.push([`${baseKey}cat`, getSpCategoryName(categoryKey)]);
				entries.forEach((feskillEntry, i) => {
					const baseSkillKey = `${baseKey}${i + 1}_`;
					const hasDependency = !!feskillEntry.dependency;
					result.push(
						[`${baseSkillKey}sp`, `${feskillEntry.skill.bp}${hasDependency ? ' {{L}}' : ''}`],
						[`${baseSkillKey}desc`, getSpDescription(feskillEntry)],
						[`${baseSkillKey}note`, hasDependency ? `(${getSpDependencyText(feskillEntry, spData.skills)})` : ''],
					);
				});
			});
	}
	return result;
}

/**
 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').IUnit} unit
 * @returns {import('./utils').WikiDataPair[]}
 */
function generateMovementData (unit) {
	const movespeedProps = ['movespeed', 'speedtype', 'movetype'];
	const result = [];
	['attack', 'idle', 'move'].forEach(prop => {
		result.push([`|animation_${prop}`, getAnimationForProperty(prop, unit) || '']);
	});
	['attack', 'skill'].forEach(prop => {
		const moveSpeedData = getMoveSpeedForProperty(prop, unit);
		movespeedProps.forEach(movespeedProp => {
			result.push([`|${movespeedProp}_${prop}`, moveSpeedData[movespeedProp]]);
		});
	});
	return result;
}

/**
 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').IUnit} unit
 * @returns {import('./utils').WikiDataPair[]}
 */
function generateStatData (unit) {
	const statProps = ['hp', 'atk', 'def', 'rec'];
	const baseStats = getStatEntriesForType('_base', unit);
	const lordStats = getStatEntriesForType('_lord', unit);
	const variedStatsByType = {
		anima: ['hp', 'rec'],
		breaker: ['atk', 'def'],
		guardian: ['def', 'rec'],
		oracle: ['def', 'rec'],
	};
	const impStats = {
		atk: unit.imp['max atk'],
		def: unit.imp['max def'],
		hp: unit.imp['max hp'],
		rec: unit.imp['max rec'],
	};
	const result = [];
	statProps.forEach(stat => {
		result.push([`|${stat}_base`, baseStats[stat]]);
	});
	statProps.forEach(stat => {
		result.push([`|${stat}_lord`, lordStats[stat]]);
	});

	['anima', 'breaker', 'guardian', 'oracle'].forEach(type => {
		const statEntry = getStatEntriesForType(type, unit);
		variedStatsByType[type].forEach(stat => {
			result.push([`|${stat}_${type}`, statEntry[stat]]);
		});
	});
	statProps.forEach(stat => {
		result.push([`|${stat}_bonus`, impStats[stat]]);
	});
	return result;
}

/**
 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').IUnit} unit
 * @returns {import('./utils').WikiDataPair[]}
 */
function generateLsData (unit) {
	const lsData = {
		desc: unit['leader skill'] && unit['leader skill'].desc,
		name: unit['leader skill'] && unit['leader skill'].name,
	};
	return [
		['|ls', lsData.name || ''],
		['|lsdescription', lsData.desc || ''],
		['|lsnote', ''],
	];
}

/**
 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').IUnit} unit
 * @returns {import('./utils').WikiDataPair[]}
 */
function generateEsData (unit) {
	const results = [];
	if (unit['extra skill']) {
		const esData = {
			desc: unit['extra skill'].desc,
			name: unit['extra skill'].name,
		};
		results.push(
			['|es', esData.name || ''],
			['|esdescription', esData.desc || ''],
			['|esitem', ''],
			['|esnote', ''],
		);
	}
	return results;
}

/**
 * @param {string} type valid types include bb, sbb, and ubb
 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').IUnit} unit
 * @param {DatabaseSpEnhancementEntry} spData
 * @returns {import('./utils').WikiDataPair[]}
 */
function generateBurstDataForBurstType (type, unit, spData) {
	const burstInfo = getBurstInfo(type, unit, spData);
	const baseKey = `|${type}`;
	const result = [
		[`${baseKey}`, burstInfo.name],
		[`${baseKey}description`, burstInfo.desc],
		[`${baseKey}note`, ''],
		[`${baseKey}type`, burstInfo.type],
		[`${baseKey}gauge`, burstInfo.gauge],
	];
	burstInfo.attacks.forEach((attack, index) => {
		const attackIndexKey = `${index > 0 ? (index + 1) : ''}`;
		const baseAttackKey = `${baseKey}${attackIndexKey}`;
		result.push(
			[`${baseAttackKey}_frames`, attack.frames],
			[`${baseAttackKey}_distribute`, attack.distribute],
			[`${baseAttackKey}_totaldistr`, attack.totaldistr],
			[`${baseAttackKey}_effectdelay`, attack.effectdelay],
			[`${baseKey}hits${attackIndexKey}`, attack.hits],
			[`${baseKey}aoe${attackIndexKey}`, attack.target],
			[`${baseKey}dc${attackIndexKey}`, (+burstInfo.dc) * attack.hits],
			[`${baseKey}multiplier${attackIndexKey}`, attack.multiplier || ''],
			[`${baseAttackKey}_hpscale`, attack.hpScaled || ''],
		);
		if (attack.sourcePath === 'SP') {
			result.push([`${baseAttackKey}_sp`, true]);
		} else if (attack.sourcePath === 'ES') {
			result.push([`${baseAttackKey}_es`, true]);
		}
	});
	return result;
}

/**
 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').IUnit} unit
 * @returns {import('./utils').WikiDataPair[]}
 */
function generateMovementDataForNormalAttacks (unit) {
	const normalFrameData = getDamageFrames(unit['damage frames']);
	return [
		['|normal_frames', normalFrameData.frames],
		['|normal_distribute', normalFrameData.distribute],
		['|normal_totaldistr', normalFrameData.totaldistr],
		['|combo_hits', normalFrameData.hits],
		['|normaldc', +unit['drop check count'] * normalFrameData.hits],
	];
}

/**
 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').IUnit} unit
 * @returns {Promise<import('./utils').WikiDataPair[]>}
 */
async function generateFlavorText (unit) {
	const baseKey = `MST_UNITCOMMENT_${unit.id}_`;
	const keys = ['description', 'summon', 'fusion', 'evolution'];
	const dictionaryKeys = keys.reduce((acc, key) => {
		acc[key] = `${baseKey}${key.toUpperCase()}`;
		return acc;
	}, {});
	let dictionaryData = {};
	try {
		dictionaryData = await bfDatabase.then(worker => worker.getByIds({
			extractedFields: ['en'],
			ids: Object.values(dictionaryKeys),
			server: appLocalStorageStore.serverName,
			table: DATA_MAPPING.dictionary.key,
		}));
	} catch (e) {
		logger.error('Error grabbing dictionary data', e);
		dictionaryData = {};
	}
	return keys.map(key => {
		const dictionaryEntry = dictionaryData[dictionaryKeys[key]];
		return [`|${key}`, (dictionaryEntry && dictionaryEntry.en) || ''];
	});
}

/**
 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').IUnit} unit
 * @returns {Promise<import('./utils').WikiDataPair[]>}
 */
async function generateEvolutionData (unit) {
	const evolutions = await getEvolutions(unit.id, (ids) => bfDatabase.then(worker => worker.getByIds({
		ids,
		server: appLocalStorageStore.serverName,
		table: DATA_MAPPING.evolutionMaterials.key,
	})));
	const currentEntry = evolutions[unit.id];
	const results = [];
	if (currentEntry) {
		results.push(
			['|evofrom', currentEntry.prev || ''],
			['|evointo', currentEntry.next || ''],
		);
		if (currentEntry.mats) {
			const evoUnits = currentEntry.mats.filter(m => m.type === 'unit').map((entry, i) => [`|evomats${i + 1}`, entry.id]);
			const evoItems = currentEntry.mats.filter(m => m.type === 'item').map((entry, i) => [`|evoitem${i !== 0 ? (i + 1) : ''}`, entry.id]);
			results.push(
				['|evozelcost', getNumberOrDefault(currentEntry.amount)],
				['|evokarmacost', ''],
				...evoUnits,
				...evoItems,
			);
		}
	}
	return results;
}

/**
 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').IUnit} primaryUnit
 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').IUnit} bondUnit
 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').IBraveBurst} bondBurst
 * @returns {import('./utils').WikiDataPair[]}
 */
function generateBondData (primaryUnit, bondUnit, bondBurst) {
	let results = [];
	if (primaryUnit && bondUnit) {
		const synergyData = getSynergyData(primaryUnit.element, bondUnit.element);
		results = [
			['|synergy', synergyData.name || ''],
			['|bondunit', bondUnit.name || ''],
		];
	}
	if (bondBurst) {
		const keySufficesToExclude = ['_frames', '_distribute', '_totaldistr', '_effectdelay'];
		/**
		 * @param {import('./utils').WikiDataPair} param
		 * @returns {boolean}
		 */
		const includeWikiDataPair = ([wikiKey]) => !keySufficesToExclude.some(suffix => wikiKey.endsWith(suffix));
		const dbbData = generateDbbData(bondBurst).filter(includeWikiDataPair);
		results = results.concat(dbbData);
	}
	return results;
}

/**
 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').IUnit} unit
 * @returns {string}
 */
function determineArenaAiType (unit) {
	let result;

	if (unit.ai) {
		const { ai } = unit;
		const ARENA_ENTRY_KEYS = ['action', 'chance%', 'target conditions', 'target type'];

		/**
		 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').IUnitArenaAiEntry} entryA
		 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').IUnitArenaAiEntry} entryB
		 * @returns {boolean}
		 */
		const arenaEntriesMatch = (entryA, entryB) => ARENA_ENTRY_KEYS.every((key) => entryA[key] === entryB[key]);
		const unitHasEntries = (entries = []) => entries.every((entry) => !!ai.find((unitAiEntry) => arenaEntriesMatch(unitAiEntry, entry)));

		result = Object.keys(ARENA_ENTRIES_BY_TYPE).find((type) => {
			const result = unitHasEntries(ARENA_ENTRIES_BY_TYPE[type]);
			return result;
		});
	}

	return result || '';
}

/**
 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').IUnit} unit
 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').IUnit} bondUnit
 * @param {string|number} bondBurstId
 */
export async function generateUnitTemplate (unit, bondUnit, bondBurstId) {
	const unitRarity = +unit.rarity;
	const spData = await getSpData(unit);
	let bondBurst;
	if (bondBurstId) {
		bondBurst = await getBurstData(bondBurstId);
	}
	/**
	 * @type {import('./utils').WikiDataPair}
	 */
	const templateData = [
		['|disam', ''],
		['|altname', unit.name],
		['|id', unit.id],
		['|idalt', ''],
		['|has_altart', ''],
		['|no', unit.guide_id],
		['|element', ELEMENT_NAME_MAPPING[unit.element]],
		['|rarity', generateRarityString(unitRarity)],
		['|cost', unit.cost],
		['|maxlv', MAX_LEVEL_MAPPING[unitRarity] || ''],
		['|basexp', 21],
		['|gender', (unit.gender || 'U')[0].toUpperCase()],
		['|ai', determineArenaAiType(unit)],
		...generateMovementData(unit),
		...(await generateFlavorText(unit)),
		...generateStatData(unit),
		['|lordonly', ''],
		...(await generateEvolutionData(unit)),
		...generateMovementDataForNormalAttacks(unit),
		...generateLsData(unit),
		...generateEsData(unit),
		...generateBurstDataForBurstType('bb', unit, spData),
		...(unit.sbb ? generateBurstDataForBurstType('sbb', unit, spData) : []),
		...(unit.ubb ? generateBurstDataForBurstType('ubb', unit, spData) : []),
		...generateBondData(unit, bondUnit, bondBurst),
		...(await generateSpData(spData)),
		['|howtoget', ''],
		['|notes', ''],
		['|incorrectinfo', ''],
		['|addcat', ''],
		['|addcatname', ''],
	];
	const isEu = appLocalStorageStore.serverName === SERVER_NAME_MAPPING.Europe;
	return `{{{{#if:{{{1|}}}|UnitProp|${isEu ? 'UnitEU' : 'Unit'}}}|prop={{{1|}}}
${generateTemplateBody(templateData)}
}}`;
}

/**
 * @param {string} code
 * @param {import('../bf-core/spEnhancements').SpEntry[]} spEntries
 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').IUnit} unit
 */
export function generateSpTemplate (code, spEntries, unit) {
	const spWikiEntries = code.split('').reduce((acc, entryCode, i) => {
		const entry = spEntries[spCodeToIndex(entryCode)];
		const wikiIndex = i + 1;
		acc.push(
			[`|sp_cost_${wikiIndex}`, getSpCost(spEntries, entryCode)],
			[`|spskill_${wikiIndex}`, getSpDescription(entry)],
		);
		return acc;
	}, []);
	const templateData = [
		['|build_name', `${unit.name} build`],
		['|element', ELEMENT_NAME_MAPPING[unit.element]],
		['|total_sp', getSpCost(spEntries, code)],
		['|author', ''],
		...spWikiEntries,
		['|analysis', ''],
		['|last_updated', new Date().toDateString()],
	];

	return `{{Build
${generateTemplateBody(templateData)}
}}`;
}

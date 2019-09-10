import {
	ELEMENT_NAME_MAPPING,
	MAX_LEVEL_MAPPING,
	SP_CATEGORY_MAPPING,
} from '@/utilities/bf-core/constants';
import { extractAttackingDamageFrames } from '@/utilities/bf-core/bursts';
import getLogger from '@/utilities/Logger';
import { getSpDescription } from '@/utilities/bf-core/spEnhancements';
const logger = getLogger('Wiki.Units');

// TODO: things to support
/**
 * multiple attacks
 * lore/flavor text
 * deep parsing of BB/SBB/UBB
 * deep parsing of ES
 * evolution materials and cost
 * passing in of SP skills
 */

 /**
	* @typedef {{ distribute: string, effectdelay: string, frames: stirng, hits: number, totaldistr: number }} WikiDamageFramesEntry
	*/

/**
 * @param {string} prop
 * @param {object} unit
 * @returns {number}
 */
function getAnimationForProperty (prop, unit) {
	let result;
	if (unit.animations || unit.animations[prop]) {
		result = unit.animations[prop]['total number of frames'];
	}
	return result;
}

/**
 * @param {string} prop
 * @param {object} unit
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
 * @param {object} damageFramesEntry
 * @returns {WikiDamageFramesEntry}
 */
function getDamageFrames (damageFramesEntry) {
	const result = {
		distribute: '',
		effectdelay: '',
		frames: '',
		hits: '',
		totaldistr: '',
	};
	if (damageFramesEntry) {
		result.distribute = Array.from(damageFramesEntry['hit dmg% distribution']).join(', ');
		result.frames = Array.from(damageFramesEntry['frame times']).join(', ');
		result.totaldistr = damageFramesEntry['hit dmg% distribution (total)'];
		result.hits = damageFramesEntry['hits'];
		if (damageFramesEntry['effect delay time(ms)/frame']) {
			result.effectdelay = damageFramesEntry['effect delay time(ms)/frame'].split('/')[1];
		}
	}
	return result;
}

/**
 * @param {string} burstProp
 * @param {object} unit
 * @returns {WikiDamageFramesEntry[]}
 */
function getBurstFrameData (burstProp, unit) {
	/**
	 * @type {WikiDamageFramesEntry[]}
	 */
	let result = [];
	if (unit[burstProp] && unit[burstProp]['damage frames']) {
		const attackingFrames = extractAttackingDamageFrames(unit[burstProp]['damage frames']);
		result = attackingFrames.map(getDamageFrames);
	}
	return result;
}

/**
 * @param {object} stats
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
 * @param {object} unit
 * @returns {{ hp: number, atk: number, def: number, rec: number }}
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
 * @param {object} unit
 * @returns {{ dc: number, desc: string, gauge: number, name: string, attacks: WikiDamageFramesEntry[] }}
 */
function getBurstInfo (type, unit) {
	const result = {
		attacks: [],
		dc: '',
		desc: '',
		gauge: '',
		name: '',
	};
	if (unit[type]) {
		const burstEntry = unit[type];
		result.attacks = getBurstFrameData(type, unit);
		result.name = burstEntry.name;
		result.desc = burstEntry.desc;
		result.dc = burstEntry['drop check count'] * result.attacks.reduce((attackCount, attack) => attackCount + attack.hits);
		result.gauge = burstEntry.levels[burstEntry.levels.length - 1]['bc cost'];
	}
	return result;
}

/**
 * @param {Array} spEnhancements
 */
function getSpInfo (spEnhancements) {
	let result = '';
	if (Array.isArray(spEnhancements)) {
		const skillsByCategory = spEnhancements.reduce((acc, feskillEntry) => {
			if (!acc[feskillEntry.category]) {
				acc[feskillEntry.category] = [];
			}
			acc[feskillEntry.category].push(feskillEntry);
			return acc;
		}, {});
		result = Object.keys(skillsByCategory)
			.sort((a, b) => +a - +b) // sort by category number
			.map((categoryKey, i) => {
				const entries = skillsByCategory[categoryKey];
				const baseKey = `|omniskill${i + 1}_`;
				const result = [
					[`${baseKey}cat`, SP_CATEGORY_MAPPING[categoryKey]],
				];
				entries.forEach((feskillEntry, i) => {
					const baseSkillKey = `${baseKey}${i + 1}_`;
					result.push([`${baseSkillKey}sp`, feskillEntry.skill.bp]);
					result.push([`${baseSkillKey}desc`, getSpDescription(feskillEntry)]);
				});
				// TODO: fix return type
				return result
					.map(([key, value]) => `${key} = ${value}`)
					.join('\n');
			}).join('');
	}
	return result;
}

/**
 * @param {object} unit
 * @returns {import('./utils').WikiDataPair[]}
 */
function generateMovementData (unit) {
	const props = ['attack', 'skill'];
	const movespeedProps = ['movespeed', 'speedtype', 'movetype'];
	const result = [];
	props.concat(['move']).forEach(prop => {
		result.push([`|animation_${prop}`, getAnimationForProperty(prop, unit)]);
	});
	props.forEach(prop => {
		const moveSpeedData = getMoveSpeedForProperty(prop, unit);
		movespeedProps.forEach(movespeedProp => {
			result.push([`|${movespeedProp}_${prop}`, moveSpeedData[movespeedProp]]);
		});
	});
	return result;
}

/**
 * @param {object} unit
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
 * @param {object} unit
 */
export function generateUnitTemplate (unit) {
	const unitRarity = +unit.rarity;
	const wikiRarity = unitRarity === 8
		? 'Omni'
		: new Array(unitRarity || 0).fill('★');
	const getNormalFrameData = () => getDamageFrames(unit['damage frames']);
	const getBurstFrameData = (burstProp) => {
		// TODO: handle attack frames properly
		logger.warn('TODO: handle attack frames properly');
		return getDamageFrames(unit[burstProp] && unit[burstProp]['damage frames'] && unit[burstProp]['damage frames'][0]);
	};

	const normalFrameData = getNormalFrameData();
	const bbFrameData = getBurstFrameData('bb');
	const sbbFrameData = getBurstFrameData('sbb');
	const ubbFrameData = getBurstFrameData('ubb');
	const baseStats = getStatEntriesForType('_base', unit);
	const lordStats = getStatEntriesForType('_lord', unit);
	const otherStats = ['anima', 'breaker', 'guardian', 'oracle'].reduce((acc, type) => {
		acc[type] = getStatEntriesForType(type, unit);
		return acc;
	}, {});
	const impStats = {
		atk: unit.imp['max atk'],
		def: unit.imp['max def'],
		hp: unit.imp['max hp'],
		rec: unit.imp['max rec'],
	};
	const lsData = {
		desc: unit['leader skill'] && unit['leader skill'].desc,
		name: unit['leader skill'] && unit['leader skill'].name,
	};
	const burstData = ['bb', 'sbb', 'ubb'].reduce((acc, type) => {
		acc[type] = getBurstInfo(type, unit);
		return acc;
	}, {});
	const esData = {
		desc: unit['extra skill'] && unit['extra skill'].desc,
		name: unit['extra skill'] && unit['extra skill'].name,
	};
	return `{{{{#if:{{{1|}}}|UnitProp|Unit}}|prop={{{1|}}}
|id                = ${unit.id}
|idalt             = 
|has_altart        = 
|no                = ${unit.guide_id}
|element           = ${ELEMENT_NAME_MAPPING[unit.element]}
|rarity            = ${wikiRarity}
|cost              = ${unit.cost}
|maxlv             = ${MAX_LEVEL_MAPPING[unitRarity] || ''}
|basexp            = 21
|gender            = ${(unit.gender || 'U')[0].toUpperCase()}
|ai                = 
d|animation_attack  = ${getAnimationForProperty('attack', unit)}
d|animation_idle    = ${getAnimationForProperty('idle', unit)}
d|animation_move    = ${getAnimationForProperty('move', unit)}
d|movespeed_attack  = ${attackMoveSpeedData.movespeed}
d|movespeed_skill   = ${skillMoveSpeedData.movespeed}
d|speedtype_attack  = ${attackMoveSpeedData.speedtype}
d|speedtype_skill   = ${skillMoveSpeedData.speedtype}
d|movetype_attack   = ${attackMoveSpeedData.movetype}
d|movetype_skill    = ${skillMoveSpeedData.movetype}
|normal_frames     = ${normalFrameData.frames}
|normal_distribute = ${normalFrameData.distribute}
|normal_totaldistr = ${normalFrameData.totaldistr}
|bb_frames         = ${bbFrameData.frames}
|bb_distribute     = ${bbFrameData.distribute}
|bb_totaldistr     = ${bbFrameData.totaldistr}
|bb2_frames        = 
|bb2_distribute    = 
|bb2_totaldistr    = 
|sbb_frames        = ${sbbFrameData.frames}
|sbb_distribute    = ${sbbFrameData.distribute}
|sbb_totaldistr    = ${sbbFrameData.totaldistr}
|sbb2_frames       = 
|sbb2_distribute   = 
|sbb2_totaldistr   = 
|ubb_frames        = ${ubbFrameData.frames}
|ubb_distribute    = ${ubbFrameData.distribute}
|ubb_totaldistr    = ${ubbFrameData.totaldistr}
|ubb2_frames       = 
|ubb2_distribute   = 
|ubb2_totaldistr   = 
|bb_effectdelay    = ${bbFrameData.effectdelay}
|bb2_effectdelay   = 
|sbb_effectdelay   = ${sbbFrameData.effectdelay}
|sbb2_effectdelay  = 
|ubb_effectdelay   = ${ubbFrameData.effectdelay}
|ubb2_effectdelay  = 
|description       = 
|summon            = 
|fusion            = 
|evolution         = 
d|hp_base           = ${baseStats.hp}
d|atk_base          = ${baseStats.atk}
d|def_base          = ${baseStats.def}
d|rec_base          = ${baseStats.rec}
d|hp_lord           = ${lordStats.hp}
d|atk_lord          = ${lordStats.atk}
d|def_lord          = ${lordStats.def}
d|rec_lord          = ${lordStats.rec}
d|hp_anima          = ${otherStats.anima.hp}
d|rec_anima         = ${otherStats.anima.rec}
d|atk_breaker       = ${otherStats.breaker.atk}
d|def_breaker       = ${otherStats.breaker.def}
d|def_guardian      = ${otherStats.guardian.def}
d|rec_guardian      = ${otherStats.guardian.rec}
d|def_oracle        = ${otherStats.oracle.def}
d|rec_oracle        = ${otherStats.oracle.rec}
d|hp_bonus          = ${impStats.hp}
d|atk_bonus         = ${impStats.atk}
d|def_bonus         = ${impStats.def}
d|rec_bonus         = ${impStats.rec}
|lordonly          = 
|combo_hits        = ${normalFrameData.hits}
|normaldc          = ${unit['drop check count'] * normalFrameData.hits}
|ls                = ${lsData.name || ''}
|lsdescription     = ${lsData.desc || ''}
|lsnote            = 
|bb                = ${burstData.bb.name}
|bbdescription     = ${burstData.bb.desc}
|bbnote            = 
|bbtype            = 
|bbhits            = 
|bbaoe             = 
|bbgauge           = ${burstData.bb.gauge}
|bbdc              =
|bbmultiplier      = 
|bb_hpscale        = 
|bbhits2           = 
|bbaoe2            = 
|bbdc2             = 
|bbmultiplier2     = 
|bb_hpscale2       = 
|sbb               = ${burstData.sbb.name}
|sbbdescription    = ${burstData.sbb.desc}
|sbbnote           = 
|sbbtype           = 
|sbbhits           = 
|sbbaoe            = 
|sbbgauge          = ${burstData.sbb.gauge}
|sbbdc             =
|sbbmultiplier     = 
|sbb_hpscale       = 
|sbbhits2          = 
|sbbaoe2           = 
|sbbdc2            = 
|sbbmultiplier2    = 
|sbb_hpscale2      = 
|ubb               = ${burstData.ubb.name}
|ubbdescription    = ${burstData.ubb.desc}
|ubbnote           = 
|ubbtype           = 
|ubbhits           = 
|ubbaoe            = 
|ubbgauge          = ${burstData.ubb.gauge}
|ubbdc             =
|ubbmultiplier     = 
|ubb_hpscale       = 
|ubbhits2          = 
|ubbaoe2           = 
|ubbdc2            = 
|ubbmultiplier2    = 
|ubb_hpscale2      = 
|es                = ${esData.name || ''}
|esitem            = 
|esdescription     = ${esData.desc || ''}
|esnote            = 
|evofrom           = 
|evointo           = 
|evomats1          = 
|evomats2          = 
|evomats3          = 
|evomats4          = 
|evomats5          = 
|evomats6          = 
|evomats7          = 
|evomats8          = 
|evomats9          = 
|evoitem           = 
|evoitem2          = 
|evozelcost        = 
|evokarmacost      = 
${getSpInfo()}|howtoget          = 
|notes             = 
|incorrectinfo     = 
|addcat            = 
|addcatname        = 
}}`;
}

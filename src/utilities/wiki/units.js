import getLogger from '@/utilities/Logger';

const logger = getLogger('Wiki.Units');

// TODO: things to support
/**
 * multiple attacks
 * lore/flavor text
 * deep parsing of BB/SBB/UBB
 * deep parsing of ES
 * evolution materials and cost
 */

function getSpDescription (spEntry = {}) {
	const { desc = '', name = '' } = spEntry.skill;
	if (desc.trim() === name.trim()) {
		return desc || '';
	} else {
		return (desc.length > name.length)
			? desc
			: [name, desc ? `(${desc})` : ''].filter(val => val).join(' ');
	}
}

/**
 * @param {object} unit
 */
export function generateUnitTemplate (unit) {
	// TODO: refactor
	const ELEMENT_NAME_MAPPINGS = {
		dark: 'Dark',
		earth: 'Earth',
		fire: 'Fire',
		light: 'Light',
		thunder: 'Thunder',
	};
	const MAX_LEVEL_MAPPINGS = {
		2: 30,
		3: 40,
		4: 60,
		5: 80,
		6: 100,
		7: 120,
		8: 150,
	};
	const SP_CATEGORY_MAPPING = Object.freeze({
		1: 'Parameter Boost',
		2: 'Spark',
		3: 'Critical Hits',
		4: 'Attack Boost',
		5: 'BB Gauge',
		6: 'HP Recovery',
		7: 'Drops',
		8: 'Ailment Resistance',
		9: 'Ailment Infliction',
		10: 'Damage Reduction', // eslint-disable-line sort-keys
		11: 'Special',
	});
	const unitRarity = +unit.rarity;
	const wikiRarity = unitRarity === 8
		? 'Omni'
		: new Array(+unit.rarity || 0).fill('★');
	const getAnimationForProperty = (prop) => {
		let result;
		if (unit.animations || unit.animations[prop]) {
			result = unit.animations[prop]['total number of frames'];
		}
		return result;
	};
	const getMoveSpeedForProperty = (prop) => {
		let result = {};
		if (unit.movement && unit.movement[prop]) {
			const movementEntry = unit.movement[prop];
			result.movespeed = movementEntry['move speed'];
			result.movetype = movementEntry['move type'];
			result.speedtype = movementEntry['move speed type'];
		}
		return result;
	};
	const extractDamageFrames = (damageFramesEntry) => {
		const result = {
			distribute: '',
			effectdelay: '',
			frames: '',
			hits: '',
			totaldistr: '',
		};
		if (damageFramesEntry) {
			result.distribute = Array.from(damageFramesEntry['hit dmg% distribution']).join(',');
			result.frames = Array.from(damageFramesEntry['frame times']).join(',');
			result.totaldistr = damageFramesEntry['hit dmg& distribution (total)'];
			result.hits = damageFramesEntry['hits'];
			if (damageFramesEntry['effect delay time(ms)/frame']) {
				result.effectdelay = damageFramesEntry['effect delay time(ms)/frame'].split('/')[1];
			}
		}
		return result;
	};
	const getNormalFrameData = () => extractDamageFrames(unit['damage frames']);
	const getBurstFrameData = (burstProp) => {
		// TODO: handle attack frames properly
		logger.warn('TODO: handle attack frames properly');
		return extractDamageFrames(unit[burstProp] && unit[burstProp]['damage frames'] && unit[burstProp]['damage frames'][0]);
	};
	const getStatEntryOrAverage = (stats, statProp) => {
		return typeof stats[statProp] !== 'undefined'
			? stats[statProp]
			: Math.floor((stats[`${statProp} max`] + stats[`${statProp} min`]) / 2);
	};
	const getStatEntriesForType = (type) => {
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
	};

	const getBurstInfo = (type) => {
		const result = {
			dc: '',
			desc: '',
			gauge: '',
			name: '',
		};
		if (unit[type]) {
			const burstEntry = unit[type];
			result.name = burstEntry.name;
			result.desc = burstEntry.desc;
			result.dc = burstEntry['drop check count'];
			result.gauge = burstEntry.levels[burstEntry.levels.length - 1]['bc cost'];
		}
		return result;
	};
	const getSpInfo = () => {
		let result = '';
		if (unit.feskills) {
			result = Array.from(unit.feskills).map((feskillEntry, i) => {
				const baseKey = `|omniskill${i + 1}_`;
				const skill = feskillEntry.skill;
				return {
					[`${baseKey}cat`]: SP_CATEGORY_MAPPING[feskillEntry.category],
					[`${baseKey}1_sp`]: skill.bp,
					[`${baseKey}1_desc`]: getSpDescription(feskillEntry),
				}
			});
		}
	};

	const attackMoveSpeedData = getMoveSpeedForProperty('attack');
	const skillMoveSpeedData = getMoveSpeedForProperty('skill');
	const normalFrameData = getNormalFrameData();
	const bbFrameData = getBurstFrameData('bb');
	const sbbFrameData = getBurstFrameData('sbb');
	const ubbFrameData = getBurstFrameData('ubb');
	const baseStats = getStatEntriesForType('_base');
	const lordStats = getStatEntriesForType('_lord');
	const otherStats = ['anima', 'breaker', 'guardian', 'oracle'].reduce((acc, type) => {
		acc[type] = getStatEntriesForType(type);
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
	const burstData = ['bb', 'sbb', ' ubb'].reduce((acc, type) => {
		acc[type] = getBurstInfo(type);
		return acc;
	}, {});
	const esData = {
		desc: unit['extra skill'] && unit['extra skill'].desc,
		name: unit['extra skill'] && unit['extra skill'].name,
	};
	const spInfo = 
	return `{{{{#if:{{{1|}}}|UnitProp|Unit}}|prop={{{1|}}}
|id                = ${unit.id}
|idalt             = 
|has_altart        = 
|no                = ${unit.guide_id}
|element           = ${ELEMENT_NAME_MAPPINGS[unit.element]}
|rarity            = ${wikiRarity}
|cost              = ${unit.cost}
|maxlv             = ${MAX_LEVEL_MAPPINGS[unitRarity] || ''}
|basexp            = ${unit.exp_pattern}
|gender            = ${(unit.gender || 'U')[0].toUpperCase()}
|ai                = 
|animation_attack  = ${getAnimationForProperty('attack')}
|animation_idle    = ${getAnimationForProperty('idle')}
|animation_move    = ${getAnimationForProperty('move')}
|movespeed_attack  = ${attackMoveSpeedData.movespeed}
|movespeed_skill   = ${skillMoveSpeedData.movespeed}
|speedtype_attack  = ${attackMoveSpeedData.speedtype}
|speedtype_skill   = ${skillMoveSpeedData.speedtype}
|movetype_attack   = ${attackMoveSpeedData.movetype}
|movetype_skill    = ${skillMoveSpeedData.movetype}
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
|hp_base           = ${baseStats.hp}
|atk_base          = ${baseStats.atk}
|def_base          = ${baseStats.def}
|rec_base          = ${baseStats.rec}
|hp_lord           = ${lordStats.hp}
|atk_lord          = ${lordStats.atk}
|def_lord          = ${lordStats.def}
|rec_lord          = ${lordStats.rec}
|hp_anima          = ${otherStats.anima.hp}
|rec_anima         = ${otherStats.anima.rec}
|atk_breaker       = ${otherStats.breaker.atk}
|def_breaker       = ${otherStats.breaker.def}
|def_guardian      = ${otherStats.guardian.def}
|rec_guardian      = ${otherStats.guardian.rec}
|def_oracle        = ${otherStats.oracle.def}
|rec_oracle        = ${otherStats.oracle.rec}
|hp_bonus          = ${impStats.hp}
|atk_bonus         = ${impStats.atk}
|def_bonus         = ${impStats.def}
|rec_bonus         = ${impStats.rec}
|lordonly          = 
|combo_hits        = ${normalFrameData.hits}
|normaldc          = ${unit['drop check count']}
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
|bbdc              = ${burstData.bb.dc}
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
|sbbdc             = ${burstData.sbb.dc}
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
|ubbdc             = ${burstData.ubb.dc}
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
|omniskill1_cat    = 
|omniskill1_1_sp   = 
|omniskill1_1_desc = 
|omniskill1_1_note = 
|omniskill1_2_sp   = 
|omniskill1_2_desc = 
|omniskill1_2_note = 
|omniskill1_3_sp   = 
|omniskill1_3_desc = 
|omniskill1_3_note = 
|omniskill1_4_sp   = 
|omniskill1_4_desc = 
|omniskill1_4_note = 
|omniskill1_5_sp   = 
|omniskill1_5_desc = 
|omniskill1_5_note = 
|omniskill1_6_sp   = 
|omniskill1_6_desc = 
|omniskill1_6_note = 
|omniskill1_7_sp   = 
|omniskill1_7_desc = 
|omniskill1_7_note = 
|omniskill1_8_sp   = 
|omniskill1_8_desc = 
|omniskill1_8_note = 
|omniskill1_9_sp   = 
|omniskill1_9_desc = 
|omniskill1_9_note = 
|omniskill1_10_sp  = 
|omniskill1_10_desc= 
|omniskill1_10_note= 
|omniskill2_cat    = 
|omniskill2_1_sp   = 
|omniskill2_1_desc = 
|omniskill2_1_note = 
|omniskill2_2_sp   = 
|omniskill2_2_desc = 
|omniskill2_2_note = 
|omniskill2_3_sp   = 
|omniskill2_3_desc = 
|omniskill2_3_note = 
|omniskill2_4_sp   = 
|omniskill2_4_desc = 
|omniskill2_4_note = 
|omniskill2_5_sp   = 
|omniskill2_5_desc = 
|omniskill2_5_note = 
|omniskill2_6_sp   = 
|omniskill2_6_desc = 
|omniskill2_6_note = 
|omniskill2_7_sp   = 
|omniskill2_7_desc = 
|omniskill2_7_note = 
|omniskill2_8_sp   = 
|omniskill2_8_desc = 
|omniskill2_8_note = 
|omniskill2_9_sp   = 
|omniskill2_9_desc = 
|omniskill2_9_note = 
|omniskill2_10_sp  = 
|omniskill2_10_desc= 
|omniskill2_10_note= 
|omniskill3_cat    = 
|omniskill3_1_sp   = 
|omniskill3_1_desc = 
|omniskill3_1_note = 
|omniskill3_2_sp   = 
|omniskill3_2_desc = 
|omniskill3_2_note = 
|omniskill3_3_sp   = 
|omniskill3_3_desc = 
|omniskill3_3_note = 
|omniskill3_4_sp   = 
|omniskill3_4_desc = 
|omniskill3_4_note = 
|omniskill3_5_sp   = 
|omniskill3_5_desc = 
|omniskill3_5_note = 
|omniskill3_6_sp   = 
|omniskill3_6_desc = 
|omniskill3_6_note = 
|omniskill3_7_sp   = 
|omniskill3_7_desc = 
|omniskill3_7_note = 
|omniskill3_8_sp   = 
|omniskill3_8_desc = 
|omniskill3_8_note = 
|omniskill3_9_sp   = 
|omniskill3_9_desc = 
|omniskill3_9_note = 
|omniskill3_10_sp  = 
|omniskill3_10_desc= 
|omniskill3_10_note= 
|omniskill4_cat    = 
|omniskill4_1_sp   = 
|omniskill4_1_desc = 
|omniskill4_1_note = 
|omniskill4_2_sp   = 
|omniskill4_2_desc = 
|omniskill4_2_note = 
|omniskill4_3_sp   = 
|omniskill4_3_desc = 
|omniskill4_3_note = 
|omniskill4_4_sp   = 
|omniskill4_4_desc = 
|omniskill4_4_note = 
|omniskill4_5_sp   = 
|omniskill4_5_desc = 
|omniskill4_5_note = 
|omniskill4_6_sp   = 
|omniskill4_6_desc = 
|omniskill4_6_note = 
|omniskill4_7_sp   = 
|omniskill4_7_desc = 
|omniskill4_7_note = 
|omniskill4_8_sp   = 
|omniskill4_8_desc = 
|omniskill4_8_note = 
|omniskill4_9_sp   = 
|omniskill4_9_desc = 
|omniskill4_9_note = 
|omniskill4_10_sp  = 
|omniskill4_10_desc= 
|omniskill4_10_note= 
|omniskill5_cat    = 
|omniskill5_1_sp   = 
|omniskill5_1_desc = 
|omniskill5_1_note = 
|omniskill5_2_sp   = 
|omniskill5_2_desc = 
|omniskill5_2_note = 
|omniskill5_3_sp   = 
|omniskill5_3_desc = 
|omniskill5_3_note = 
|omniskill5_4_sp   = 
|omniskill5_4_desc = 
|omniskill5_4_note = 
|omniskill5_5_sp   = 
|omniskill5_5_desc = 
|omniskill5_5_note = 
|omniskill5_6_sp   = 
|omniskill5_6_desc = 
|omniskill5_6_note = 
|omniskill5_7_sp   = 
|omniskill5_7_desc = 
|omniskill5_7_note = 
|omniskill5_8_sp   = 
|omniskill5_8_desc = 
|omniskill5_8_note = 
|omniskill5_9_sp   = 
|omniskill5_9_desc = 
|omniskill5_9_note = 
|omniskill5_10_sp  = 
|omniskill5_10_desc= 
|omniskill5_10_note= 
|omniskill6_cat    = 
|omniskill6_1_sp   = 
|omniskill6_1_desc = 
|omniskill6_1_note = 
|omniskill6_2_sp   = 
|omniskill6_2_desc = 
|omniskill6_2_note = 
|omniskill6_3_sp   = 
|omniskill6_3_desc = 
|omniskill6_3_note = 
|omniskill6_4_sp   = 
|omniskill6_4_desc = 
|omniskill6_4_note = 
|omniskill6_5_sp   = 
|omniskill6_5_desc = 
|omniskill6_5_note = 
|howtoget          = 
|notes             = 
|incorrectinfo     = 
|addcat            = 
|addcatname        = 
}}`;
}

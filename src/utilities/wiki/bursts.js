import {
	extractAttackingDamageFrames,
	getBurstLevelEntry,
} from '@/utilities/bf-core/bursts';
import { generateTemplateBody } from './utils';

/**
 * @description mapping of elements joined in alphabetical order to DBB synergy name
 */
const ELEMENT_PAIR_TO_SYNERGY_NAME_MAPPING = Object.freeze({
	darkdark: 'Abyss',
	darkearth: 'Obsidian',
	darkfire: 'Pyre',
	darklight: 'Twilight',
	darkthunder: 'Cyclone',
	darkwater: 'Miasma',
	earthearth: 'Tremor',
	earthfire: 'Magma',
	earthlight: 'Prism',
	earththunder: 'Eruption',
	earthwater: 'Quagmire',
	firefire: 'Blaze',
	firelight: 'Nova',
	firethunder: 'Blast',
	firewater: 'Steam',
	lightlight: 'Aurora',
	lightthunder: 'Radiance',
	lightwater: 'Mist',
	thunderthunder: 'Plasma',
	thunderwater: 'Tempest',
	waterwater: 'Tsunami',
});

const SYNERGY_NAME_TO_DESCRIPTION_MAPPING = {
	Abyss: 'Deals piercing max HP% DoT to single Light foe',
	Aurora: 'Deals piercing max HP% DoT to single Dark foe',
	Blast: 'Deals piercing max HP% damage to single foe, raises allies from KO, grants Invincibility but inflicts KO on all allies on effect end (available when foe HP is below certain amount)',
	Blaze: 'Deals piercing max HP% DoT to single Earth foe',
	Cyclone: 'Chance to negate KO resistance effects',
	Eruption: 'Chance to negate Purge effects',
	Magma: 'Chance to negate BB and OD Drain effects',
	Miasma: 'Reduces healing effectiveness of single foe',
	Mist: 'Chance to purge and negate Amnesia effect & reduces BB activation cost',
	Nova: 'Chance to purge and negate Lock effects',
	Obsidian: 'Refills consumable items by certain amount (limited activation per battle)',
	Plasma: 'Deals piercing max HP% DoT to single Water foe',
	Prism: 'Deals piercing max HP% damage to single foe and boosts offense but self-KO until battle end (available when foe HP is below certain amount)',
	Pyre: 'Chance to purge and negate Doom and Ennui effects',
	Quagmire: 'Purges Barrier and Shield effects & activates non-elemental Shield',
	Radiance: 'Chance to purge and negate HP and Heal reduction effects',
	Steam: 'Boosts DBB Synergy Shards (available when cooldown count is 0)',
	Tempest: 'Chance to purge and negate Turn Skip',
	Tremor: 'Deals piercing max HP% DoT to single Thunder foe',
	Tsunami: 'Deals piercing max HP% DoT to single Fire foe',
	Twilight: 'Boosts max HP relative to Rec and raises max HP limit',
};

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
 * @param {object} damageFramesEntry
 * @returns {WikiDamageFramesEntry}
 */
export function getDamageFrames (damageFramesEntry) {
	// TODO: refactor units generator to use this
	const result = {
		distribute: '',
		effectdelay: '',
		frameIndex: -1,
		frames: '',
		hits: 0,
		totaldistr: '',
	};
	if (damageFramesEntry) {
		result.distribute = Array.from(damageFramesEntry['hit dmg% distribution']).join(', ');
		result.frameIndex = damageFramesEntry.frameIndex;
		result.frames = Array.from(damageFramesEntry['frame times']).join(', ');
		result.totaldistr = damageFramesEntry['hit dmg% distribution (total)'];
		result.hits = damageFramesEntry.hits;
		if (damageFramesEntry['effect delay time(ms)/frame']) {
			result.effectdelay = damageFramesEntry['effect delay time(ms)/frame'].split('/')[1];
		}
	}
	return result;
}

/**
 * @param {object} burst
 * @returns {WikiDamageFramesEntry[]}
 */
export function getBurstFrameData (burst) {
	/**
	 * @type {WikiDamageFramesEntry[]}
	 */
	let result = [];
	if (burst && burst['damage frames']) {
		const lastLevel = getBurstLevelEntry(burst);
		const attackingFrames = extractAttackingDamageFrames(burst['damage frames']);
		const applyEffectDataToFrame = (frame, correspondingEffect) => {
			frame.target = (correspondingEffect['target area'] === 'aoe' && !correspondingEffect['random attack']) ? 'A' : '1';
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
	}
	return result;
}

/**
 * @param {object} burst
 * @returns {{ dc: number, desc: string, gauge: number, name: string, attacks: WikiDamageFramesEntry[], type: "Offense"|"Heal"|"Support" }}
 */
function getBurstInfo (burst) {
	const result = {
		attacks: [],
		dc: '',
		desc: '',
		gauge: '',
		name: '',
		type: '',
	};
	if (burst) {
		result.attacks = getBurstFrameData(burst);
		result.name = burst.name;
		result.desc = burst.desc;
		result.dc = burst['drop check count'];
		result.gauge = burst.levels[burst.levels.length - 1]['bc cost'];

		if (result.attacks.length > 0) {
			result.type = 'Offense';
		} else {
			/**
			 * @type {string[]}
			 */
			const presentProcs = burst['damage frames'].map(frame => !isNaN(frame['proc id']) ? frame['proc id'] : frame['unknown proc id']);
			result.type = presentProcs.some(id => +id === 2 || +id === 3) ? 'Heal' : 'Support';
		}
	}
	return result;
}

/**
 * @param {object} burst
 * @returns {import('./utils').WikiDataPair[]}
 */
export function generateDbbData (burst) {
	const burstInfo = getBurstInfo(burst);
	const baseKey = '|dbb';
	const result = [
		[baseKey, burstInfo.name],
		[`${baseKey}description`, burstInfo.desc],
		[`${baseKey}type`, burstInfo.type],
		[`${baseKey}gauge`, 7],
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
	});
	return result;
}

/**
 * @param {string} element1
 * @param {string} element2
 */
export function getSynergyData (element1, element2) {
	const elementPair = element1 < element2 ? `${element1}${element2}` : `${element2}${element1}`;
	const name = ELEMENT_PAIR_TO_SYNERGY_NAME_MAPPING[elementPair];
	const description = SYNERGY_NAME_TO_DESCRIPTION_MAPPING[name];
	return { description, name };
}

/**
 * @param {object} burst
 */
export function generateDbbTemplate (burst, unit1, unit2) {
	const synergyInfo = getSynergyData((unit1 && unit1.element) || '', (unit2 && unit2.element) || '');
	/**
	 * @type {import('./utils').WikiDataPair}
	 */
	const templateData = [
		['|unreleased', ''],
		...generateDbbData(burst),
		['|synergy', synergyInfo.name || ''],
		['|synergydesc', synergyInfo.description || ''],
		['|bondunit1', (unit1 && unit1.name) || ''],
		['|bondunit2', (unit2 && unit2.name) || ''],
		['|trivia', ''],
		['|errors', ''],
	];
	return `{{DBB
${generateTemplateBody(templateData)}
}}`;
}

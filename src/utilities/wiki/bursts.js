import {
	extractAttackingDamageFrames,
	getBurstLevelEntry,
} from '@/utilities/bf-core/bursts';
import { generateTemplateBody } from './utils';

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
function generateDbbData (burst) {
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
 * @param {object} burst
 * @returns {import('./utils').WikiDataPair[]}
 */
function generateDbbLevelData (burst) {
	/**
	 * @type {import('./utils').WikiDataPair}
	 */
	const result = [];

	if (burst && Array.isArray(burst.levels)) {
		burst.levels.map((levelEntry, index) => {
			const baseKey = `|dbb_level${index + 1}_`;
			result.push(
				[`${baseKey}cost`, levelEntry['bc cost']],
				[`${baseKey}note`, '[Description]\nElemental Synergy Effect: [SynergyDescription]'],
			);
		});
	}
	return result;
}

/**
 * @param {object} burst
 */
export function generateDbbTemplate (burst) {
	/**
	 * @type {import('./utils').WikiDataPair}
	 */
	const templateData = [
		...generateDbbData(burst),
		['|synergy', 'Twilight'], // TODO
		['|synergydesc', 'Boosts max HP relative to Rec and raises max HP limit'], // TODO
		['|bondunit1', 'Xenon, Son of Elysia'], // TODO
		['|bondunit2', 'Estia, Regalia of Elysia'], // TODO
		...generateDbbLevelData(burst),
		['|trivia', ''],
		['|errors', ''],
	];
	return `{{DBB
${generateTemplateBody(templateData)}
}}`;
}

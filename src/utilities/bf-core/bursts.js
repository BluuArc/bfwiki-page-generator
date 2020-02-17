import {
	BURST_TYPES,
	TARGET_AREA_MAPPING,
} from './constants';
import {
	getEffectId,
	isAttackingProcId,
} from '@bluuarc/bfmt-utilities/dist/buffs';
import {
	getExtraAttackDamageFramesEntry,
	getLevelEntryForBurst,
} from '@bluuarc/bfmt-utilities/dist/bursts';

/**
 * @typedef {import('@bluuarc/bfmt-utilities/dist/datamine-types').ProcEffect | import('@bluuarc/bfmt-utilities/dist/datamine-types').PassiveEffect} ProcPassiveEffect
 */

/**
 * @param {Array<import('@bluuarc/bfmt-utilities/dist/datamine-types').IBurstDamageFramesEntry>} damageFrames
 */
export function extractAttackingDamageFrames (damageFrames) {
	return damageFrames
		.map((frame, i) => ({ ...frame, frameIndex: i }))
		.filter(frame => isAttackingProcId(getEffectId(frame)));
}

/**
 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').IBraveBurst} burst
 * @param {number?} level
 */
export function getBurstLevelEntry (burst, level) {
	return getLevelEntryForBurst(burst, level);
}

/**
 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').IBraveBurst} burst
 * @returns {import('@bluuarc/bfmt-utilities/dist/datamine-types').IDamageFramesEntry}
 */
export function getExtraAttackFrames (burst) {
	return getExtraAttackDamageFramesEntry(burst['damage frames']);
}

/**
 * @param {ProcPassiveEffect} effect
 * @param {string} sourcePath
 */
function extractBuffsFromTriggeredEffect (effect = {}, sourcePath) {
	return Array.isArray(effect['triggered effect'])
		? Array.from(effect['triggered effect']).map(e => {
			const mappedEffect = { ...e, sourcePath };
			BURST_TYPES.forEach(burstType => {
				const key = `trigger on ${burstType}`;
				if (effect[key]) {
					mappedEffect[key] = true;
				}
			});
			return mappedEffect;
		})
		: [];
}

/**
 * @param {ProcPassiveEffect[]} effects
 * @param {string} sourcePath
 * @param {function} getDamageFramesForIndex
 */
export function getAttackingEffectsForEffectsList (effects = [], sourcePath, getDamageFramesForIndex = () => ({ hits: 0 })) {
	const procTransformer = (e, i) => ({
		'effect delay time(ms)/frame': e['effect delay time(ms)/frame'],
		hits: e.hits || (getDamageFramesForIndex(i) || {}).hits || 0,
		id: `${e['proc id'] || e['unknown proc id']}`,
		originalEffect: e,
		sourcePath: e.sourcePath,
		target: TARGET_AREA_MAPPING[e['random attack'] ? 'random' : e['target area']],
		...(BURST_TYPES.reduce((acc, burstType) => {
			if (e[`trigger on ${burstType}`]) {
				acc[burstType] = true;
			}
			return acc;
		}, {})),
	});
	const attackFilter = e => isAttackingProcId(e.id);
	const effectsWithIndices = effects.map((e, i) => ({ ...e, originalIndex: i }));
	const triggeredEffects = effectsWithIndices.filter(e => e['triggered effect']);

	// if triggered effect, then input list is set of passives, which don't have procs
	let result = [];
	if (triggeredEffects.length > 0) {
		result = triggeredEffects.map(e => extractBuffsFromTriggeredEffect(e, sourcePath))
			.reduce((acc, list) => acc.concat(list), []);
	} else {
		result = effectsWithIndices.filter(e => e['proc id'] || e['unknown proc id']);
	}
	return result.map(e => procTransformer(e, e.originalIndex))
		.filter(attackFilter);
}

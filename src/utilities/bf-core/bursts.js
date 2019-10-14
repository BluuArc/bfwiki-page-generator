import {
	BURST_TYPES,
	TARGET_AREA_MAPPING,
} from './constants';

const PROC_PASSIVE_METADATA = require('@/assets/passive-proc-metadata.json');
const ATTACKING_PROCS = Object.keys(PROC_PASSIVE_METADATA.proc).filter(id => PROC_PASSIVE_METADATA.proc[id].Type === 'Attack');

/**
 * @param {Array<object>} damageFrames
 * @returns {Array<object>}
 */
export function extractAttackingDamageFrames (damageFrames) {
	return damageFrames
		.map((frame, i) => ({ ...frame, frameIndex: i }))
		.filter(frame => {
			const procId = !isNaN(frame['proc id']) ? frame['proc id'] : frame['unknown proc id'];
			return ATTACKING_PROCS.includes(procId);
		});
}

/**
 * @param {object} burst
 * @param {number?} level
 * @returns {{ 'bc cost': number, effects: Array }}
 */
export function getBurstLevelEntry (burst, level) {
	/**
	 * @type {Array}
	 */
	const burstEffectsByLevel = Array.isArray(burst.levels) ? burst.levels : [];
	// default to last level
	const levelIndex = (level !== undefined) ? level : burstEffectsByLevel.length - 1;
	return burstEffectsByLevel[levelIndex];
}

function getHitCountData (burst, filterFn = (f) => ATTACKING_PROCS.includes(f.id)) {
	if (typeof burst !== 'object' || Object.keys(burst).length === 0) {
		return [];
	}
	const endLevel = getBurstLevelEntry(burst);
	return burst['damage frames']
		.map((f, i) => {
			const effectData = endLevel.effects[i];
			return {
				delay: effectData['effect delay time(ms)/frame'],
				effects: effectData,
				frames: f,
				id: (f['proc id'] || f['unknown proc id'] || f.id || '').toString(),
				target: TARGET_AREA_MAPPING[effectData['random attack'] ? 'random' : effectData['target area']],
			};
		}).filter(filterFn);
}

/**
 * @param {object} burst
 * @returns {{ 'frame times': number[], 'hit dmg% distribution': number[], hits: number, 'hit dmg% distribution (total)': number }}
 */
export function getExtraAttackFrames (burst) {
	const attackFrameSets = getHitCountData(burst).map(d => d.frames);
	const healFrameSets = getHitCountData(burst, e => e.id === '2').map(d => d.frames);

	let frameTimes = [];
	let hitDmgDistribution = [];

	// gather frame data
	attackFrameSets.forEach((frameSet, i) => {
		const keepFirstFrame = i === 0;
		frameTimes = frameTimes.concat(frameSet['frame times'].slice(keepFirstFrame ? 0 : 1));
		hitDmgDistribution = hitDmgDistribution.concat(frameSet['hit dmg% distribution'].slice(keepFirstFrame ? 0 : 1));
	});

	healFrameSets.forEach((frameSet, i) => {
		const keepFirstFrame = i === 0 && attackFrameSets.length === 0;
		frameTimes = frameTimes.concat(frameSet['frame times'].slice(keepFirstFrame ? 0 : 1));
		hitDmgDistribution = hitDmgDistribution.concat(frameSet['hit dmg% distribution'].slice(keepFirstFrame ? 0 : 1));
	});

	// sort frames by frame time
	/**
	 * @type {{ dmg: number, time: number }[]}
	 */
	const unifiedFrames = [];
	frameTimes.forEach((time, i) => {
		unifiedFrames.push({
			dmg: hitDmgDistribution[i],
			time,
		});
	});

	const frames = {
		'frame times': [],
		'hit dmg% distribution': [],
	};
	unifiedFrames.sort((a, b) => a.time - b.time).forEach(({ time, dmg }) => {
		frames['frame times'].push(time);
		frames['hit dmg% distribution'].push(dmg);
	});
	frames.hits = frames['frame times'].length;
	frames['hit dmg% distribution (total)'] = unifiedFrames.reduce((acc, { dmg }) => acc + dmg, 0);
	return frames;
}

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
	const attackFilter = e => ATTACKING_PROCS.includes(e.id);
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

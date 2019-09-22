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

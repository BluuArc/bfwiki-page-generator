/**
 * @desc Get the name of the unit in the format of `[guide_id]: [name] ([id])`
 * @param {object} unit
 */
export function getFullName (unit = {}) {
	const guideId = unit.guide_id || 0;
	const name = unit.name || 'Error getting name.';
	const id = unit.id || 0;
	return `${guideId}: ${name} (${id})`;
}

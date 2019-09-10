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

/**
 * @param {string} id
 * @param {string} baseContentUrl
 * @param {string?} suffix
 */
export function getImageUrls (id, baseContentUrl, suffix = '') {
	const baseUrl = `${baseContentUrl}/unit/img`;

	return {
		anime: `${baseUrl}/unit_thum_${id}${suffix}.png`,
		ills_battle: `${baseUrl}/unit_ills_battle_${id}${suffix}.png`,
		ills_full: `${baseUrl}/unit_ills_full_${id}${suffix}.png`,
		ills_thum: `${baseUrl}/unit_ills_thum_${id}${suffix}.png`,
	};
}

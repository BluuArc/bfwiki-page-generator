/**
 * @param {object} spEntry
 */
export function getSpDescription (spEntry = {}) {
	const { desc = '', name = '' } = spEntry.skill;
	if (desc.trim() === name.trim()) {
		return desc || '';
	} else {
		return (desc.length > name.length)
			? desc
			: [name, desc ? `(${desc})` : ''].filter(val => val).join(' ');
	}
}

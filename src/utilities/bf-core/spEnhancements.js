import {
	getAllDependenciesForSpEntry,
	getAllEntriesThatDependOnSpEntry as getAllEntriesThatDependOnSpEntryAsSkillEntries,
	getSpEntryWithId,
	spCodeToIndex,
	spIndexToCode,
} from '@bluuarc/bfmt-utilities/dist/sp-enhancements';

/**
 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').ISpEnhancementEntry} spEntry
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

/**
 * @param {SpEntry} spEntry
 * @param {Array<import('@bluuarc/bfmt-utilities/dist/datamine-types').ISpEnhancementEntry>} allEntries
 */
export function getSpDependencyText (spEntry = {}, allEntries = []) {
	const dependentSpEntry = spEntry.dependency && getSpEntryWithId(spEntry.dependency, allEntries);

	return dependentSpEntry
		? `Prerequisite: Unlock "${getSpDescription(dependentSpEntry)}"`
		: (spEntry['dependency comment'] || 'Requires another enhancement');
}

/**
 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').ISpEnhancementEntry} spEntry
 * @param {Array<import('@bluuarc/bfmt-utilities/dist/datamine-types').ISpEnhancementEntry>} allEntries
 * @returns {Array<string>} Array of SP Entries as character codes
 */
export function getAllDependenciesFromSpEntry (spEntry = {}, allEntries = []) {
	return getAllDependenciesForSpEntry(spEntry, allEntries)
		.map(s => spIndexToCode(allEntries.indexOf(s)));
}

/**
 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').ISpEnhancementEntry} spEntry
 * @param {Array<import('@bluuarc/bfmt-utilities/dist/datamine-types').ISpEnhancementEntry>} allEntries
 * @returns {Array<string>} Array of SP Entries as character codes
 */
export function getAllEntriesThatDependOnSpEntry (spEntry = {}, allEntries = []) {
	return getAllEntriesThatDependOnSpEntryAsSkillEntries(spEntry, allEntries)
		.map(s => spIndexToCode(allEntries.indexOf(s)));
}

/**
 * @param {Array<import('@bluuarc/bfmt-utilities/dist/datamine-types').ISpEnhancementEntry>} allEntries
 * @param {string} code
 */
export function getSpCost (allEntries, code = '') {
	const isValidFeSKills = Array.isArray(allEntries) && allEntries.length > 0;
	if (!isValidFeSKills || !code) {
		return 0;
	}
	return code.split('')
		.map(char => allEntries[spCodeToIndex(char)])
		.filter(v => v)
		.reduce((acc, s) => acc + +s.skill.bp, 0);
}

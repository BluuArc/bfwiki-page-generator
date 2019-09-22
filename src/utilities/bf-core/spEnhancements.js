/**
 * @typedef {{ bp: number, desc: string, effects: Array, id: number, level: number, name: string, series: string }} SpEntrySkill
 * @typedef {{ category: string, dependency: string, 'dependency comment': string, id: string, skill: SpEntrySkill }} SpEntry
 */

/**
 * A-Z = 0-25, a-z = 26+
 * @param {string} char
 */
export function spCodeToIndex (char) {
	return char.charCodeAt(0) - ((char < 'a') ? 'A'.charCodeAt(0) : ('a'.charCodeAt(0))) + (char < 'a' ? 0 : 26);
}

/**
 * A-Z = 0-25, a-z = 26+
 * @param {number} index
 */
export function spIndexToCode (index) {
	return String.fromCharCode(index >= 26 ? (index - 26 + 'a'.charCodeAt(0)) : (index + 'A'.charCodeAt(0)));
}

/**
 * @param {SpEntry} spEntry
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
 * @param {{ id: string } | string?} id
 */
export function getSpEntryId (id = '') {
	/**
	 * @type {string}
	 */
	let spId = id;
	if (typeof spId === 'object') {
		spId = id.id; // given an spEntry object
	}
	return (spId.includes('@') && spId.split('@')[1]) || spId;
}

/**
 * @param {string} id
 * @param {Array<SpEntry>} spEntries
 */
export function getSpEntryWithId (id, spEntries = []) {
	const entryId = getSpEntryId(id);
	return spEntries.find(s => getSpEntryId(s.id) === entryId);
}

/**
 * @param {SpEntry} spEntry
 * @param {Array<SpEntry>} allEntries
 */
export function getSpDependencyText (spEntry = {}, allEntries = []) {
	const dependentSpEntry = spEntry.dependency && getSpEntryWithId(spEntry.dependency, allEntries);

	return dependentSpEntry
		? `Prerequisite: Unlock "${getSpDescription(dependentSpEntry)}"`
		: (spEntry['dependency comment'] || 'Requires another enhancement');
}

/**
 * @param {SpEntry} spEntry
 * @param {Array<SpEntry>} allEntries
 * @returns {Array<string>} Array of SP Entries as character codes
 */
export function getAllDependenciesFromSpEntry (spEntry = {}, allEntries = []) {
	const dependencies = [];
	if (spEntry.dependency) {
		const dependencyId = getSpEntryId(spEntry.dependency);
		const dependencyIndex = allEntries.findIndex(s => getSpEntryId(s.id).toString() === dependencyId);
		if (dependencyIndex > -1) {
			dependencies.push(spIndexToCode(dependencyIndex));
			const subDependencies = getAllDependenciesFromSpEntry(allEntries[dependencyIndex], allEntries);
			subDependencies.forEach(subDependency => {
				dependencies.push(subDependency);
			});
		}
	}
	return dependencies;
}

/**
 * @param {SpEntry} spEntry
 * @param {Array<SpEntry>} allEntries
 * @returns {Array<string>} Array of SP Entries as character codes
 */
export function getAllEntriesThatDependOnSpEntry (spEntry = {}, allEntries = []) {
	const dependents = allEntries
		.map((entry, index) => ({ entry, index }))
		.filter(({ entry }) => entry.dependency && entry.dependency.includes(spEntry.id))
		.map(({ index }) => spIndexToCode(index));
	const subDependents = dependents.map(depCode => getAllEntriesThatDependOnSpEntry(allEntries[spCodeToIndex(depCode)], allEntries))
		.reduce((acc, val) => acc.concat(val), []);
	return Array.from(new Set(dependents.concat(subDependents)));
}

/**
 * @param {Array<SpEntry>} allEntries
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

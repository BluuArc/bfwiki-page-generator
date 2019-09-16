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

/**
 * @typedef {{ id: string, name: string, type: "unit"|"item" }} EvolutionEntry.mat
 * @typedef {{ id: number, name: string, rarity: number }} EvolutionEntry.evo
 * @typedef {{ amount: number, evo: EvolutionEntry.evo, mats: EvolutionEntry.mat[], name: string, rarity: 8, prev?: number, next?: number }} EvolutionEntry
 */

/**
 * Get all the evolutions of a given unit ID
 * @param {number} unitId
 * @param {function(): Promise<{ [key: string]: EvolutionEntry }>} getUnitEvosById
 * @returns {Promise<{ [key: string]: EvolutionEntry }>}
 */
export async function getEvolutions (unitId, getUnitEvosByIds) {
	const parsedUnitId = +unitId;
	const category = (parsedUnitId) - (parsedUnitId % 10);
	const ids = new Array(10).fill(0).map((_, i) => `${category + i}`);
	/**
	 * @type {{ [key: string]: EvolutionEntry }}
	*/
	const data = await Promise.resolve(getUnitEvosByIds(ids));
	const dataPairs = Object.entries(data).filter(p => p[1]);
	let correspondingEntry = dataPairs.filter(p => (+p[0] === parsedUnitId))[0]; // attempt to find main entry
	if (!correspondingEntry) {
		// find corresponding evolved entry (case for when given final evolution)
		correspondingEntry = dataPairs.filter(p => +p[1].evo.id === parsedUnitId)[0];
	}

	const result = {};
	const addEntryToResult = (id, entry) => {
		if (+id !== +entry.evo.id) {
			const nextId = +entry.evo.id;
			result[id] = { ...(result[id] || {}), ...entry, next: nextId };
			result[nextId] = { ...(result[nextId] || {}), prev: +id };
		}
	};
	if (correspondingEntry) {
		const getPairThatEvolvesIntoId = (id) => dataPairs.filter(p => +p[1].evo.id === +id)[0];
		const getEvoPairWithId = (id) => dataPairs.filter(p => +p[0] === +id)[0];
		addEntryToResult(parsedUnitId, correspondingEntry[1]);
		// find all units before this ID
		let currentEntry = getPairThatEvolvesIntoId(parsedUnitId);
		while (currentEntry) {
			addEntryToResult(currentEntry[0], currentEntry[1]);
			currentEntry = getPairThatEvolvesIntoId(currentEntry[0]);
		}

		// find all units after this ID
		let nextEvoEntry = correspondingEntry.evo && getEvoPairWithId(correspondingEntry.evo.id);
		while (nextEvoEntry) {
			addEntryToResult(nextEvoEntry[0], nextEvoEntry[1]);
			nextEvoEntry = nextEvoEntry[1].evo && getEvoPairWithId(nextEvoEntry[1].evo.id);
		}
	}
	return result;
}

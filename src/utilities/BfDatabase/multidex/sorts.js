import { DATA_MAPPING, ELEMENTS } from '@/utilities/constants';
import { applySorts, commonSorts } from './utils';

/**
 * @typedef {{ type: string, isAscending: boolean}} SortOptions
 */

/**
 * @type {Map<string, function(): Array<any>}
 */
const mappingByType = new Map();

/**
 * @param {object} arg0
 * @param {Array<any>} arg0.keys
 * @param {SortOptions} arg0.sortOptions
 * @param {{ [key: string]: function(): number }} arg0.sortTypes
 * @returns {Array<any>}
 */
function sortWrapper ({ keys, sortOptions, sortTypes }) {
	const { isAscending = true, type = 'ID' } = sortOptions;
	return applySorts({
		input: keys,
		isAscending,
		sortFn: sortTypes[type],
	});
}

/**
 * @param {object} arg0
 * @param {object} arg0.db
 * @param {Array<string>} arg0.keys
 * @param {SortOptions} arg0.sortOptions
 * @returns {Array<string>}
 */
function sortUnits ({ db, keys, sortOptions }) {
	return sortWrapper({
		keys,
		sortOptions,
		sortTypes: {
			Alphabetical: (idA, idB) => commonSorts.Alphabetical(idA, idB, (id) => db[id].name),
			Elements: (idA, idB) => commonSorts.Numerical(idA, idB, (id) => ELEMENTS.indexOf(db[id].element)),
			'Guide ID': (idA, idB) => commonSorts.Numerical(idA, idB, (id) => +db[id].guide_id),
			Rarity: (idA, idB) => commonSorts.Numerical(idA, idB, (id) => +db[id].rarity),
			'Unit ID': commonSorts.ID,
		},
	});
}
mappingByType.set(DATA_MAPPING.units.key, sortUnits);

export default mappingByType;

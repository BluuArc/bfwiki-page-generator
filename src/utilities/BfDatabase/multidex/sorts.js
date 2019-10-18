import {
	ELEMENTS,
	ITEM_TYPES,
} from '@/utilities/bf-core/constants';
import { applySorts, commonSorts } from './utils';
import { DATA_MAPPING } from '@/utilities/constants';

/**
 * @typedef {{ type: string, isAscending: boolean}} SortOptions
 */

/**
 * @typedef {object} DbSortFunctionArguments
 * @property {{ [key: string]: any }} DbSortFunctionArguments.db
 * @property {Array<any>} DbSortFunctionArguments.keys
 * @property {SortOptions} DbSortFunctionArguments.sortOptions
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
 * @param {DbSortFunctionArguments} arg0
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

/**
 * @param {DbSortFunctionArguments} arg0
 * @returns {Array<string>}
 */
function sortItems ({ db, keys, sortOptions }) {
	return sortWrapper({
		keys,
		sortOptions,
		sortTypes: {
			Alphabetical: (idA, idB) => commonSorts.Alphabetical(idA, idB, (id) => db[id].name),
			'Item ID': commonSorts.ID,
			Rarity: (idA, idB) => commonSorts.Numerical(idA, idB, (id) => +db[id].rarity),
			Type: (idA, idB) => commonSorts.Numerical(idA, idB, (id) => ITEM_TYPES.indexOf(db[id].type)),
		},
	});
}
mappingByType.set(DATA_MAPPING.items.key, sortItems);

/**
 * @param {DbSortFunctionArguments} arg0
 * @returns {Array<string>}
 */
function sortExtraSkills ({ db, keys, sortOptions }) {
	return sortWrapper({
		keys,
		sortOptions,
		sortTypes: {
			Alphabetical: (idA, idB) => commonSorts.Alphabetical(idA, idB, (id) => db[id].name),
			Rarity: (idA, idB) => commonSorts.Numerical(idA, idB, (id) => +db[id].rarity),
			'Skill ID': commonSorts.ID,
		},
	});
}
mappingByType.set(DATA_MAPPING.extraSkills.key, sortExtraSkills);

/**
 * @param {DbSortFunctionArguments} arg0
 * @returns {Array<string>}
 */
function sortBursts ({ db, keys, sortOptions }) {
	return sortWrapper({
		keys,
		sortOptions,
		sortTypes: {
			Alphabetical: (idA, idB) => commonSorts.Alphabetical(idA, idB, (id) => db[id].name),
			'Burst ID': commonSorts.ID,
		},
	});
}
mappingByType.set(DATA_MAPPING.bursts.key, sortBursts);

export default mappingByType;

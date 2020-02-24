import { DATA_MAPPING } from '@/utilities/constants';
import { getFullName } from '@/utilities/bf-core/units';
import { parseNameQuery } from './utils';

/**
 * @typedef {object} DbFilterFunctionArguments
 * @property {{ [key: string]: object }} DbFilterFunctionArguments.db
 * @property {{ [key: string]: any }} DbFilterFunctionArguments.filters
 */

/**
 * @type {Map<string, function(): Array<string>}
 */
const mappingByType = new Map();

/**
 * @param {DbFilterFunctionArguments} arg0
 * @returns {Array<string>}
 */
function getFilteredDbUnit ({ db, filters }) {
	if (typeof filters === 'undefined') {
		return Object.keys(db);
	}

	const {
		keys = Object.keys(db),
		name = '',
	} = filters;
	const names = parseNameQuery(name);

	const fitsQuery = (key) => {
		/**
		 * @type {import('@bluuarc/bfmt-utilities/dist/datamine-types').IUnit}
		 */
		const entry = db[key];
		const fullName = getFullName(entry).toLowerCase();
		const normalizedKey = key.toString().toLowerCase();
		const fitsName = !name || names.some(n => fullName.includes(n));
		const fitsKey = !name || names.some(n => normalizedKey.includes(n));
		return [fitsName || fitsKey].every(v => v);
	};

	return keys.filter(key => db.hasOwnProperty(key) && fitsQuery(key));
}
mappingByType.set(DATA_MAPPING.units.key, getFilteredDbUnit);

/**
 * @param {DbFilterFunctionArguments} arg0
 * @returns {Array<string>}
 */
function getFilteredDbItem ({ db, filters }) {
	if (typeof filters === 'undefined') {
		return Object.keys(db);
	}

	const {
		keys = Object.keys(db),
		name = '',
	} = filters;
	const names = parseNameQuery(name);

	const fitsQuery = (key) => {
		/**
		 * @type {import('@bluuarc/bfmt-utilities/dist/datamine-types').IItem}
		 */
		const entry = db[key];
		const entryName = entry.name.toLowerCase();
		const description = entry.desc.toLowerCase();
		const normalizedKey = key.toString().toLowerCase();
		const fitsNameOrDescription = !name || names.some(n => entryName.includes(n) || description.includes(n));
		const fitsKey = !name || names.some(n => normalizedKey.includes(n));
		return [fitsNameOrDescription || fitsKey].every(v => v);
	};

	return keys.filter(key => db.hasOwnProperty(key) && fitsQuery(key));
}
mappingByType.set(DATA_MAPPING.items.key, getFilteredDbItem);

/**
 * @param {DbFilterFunctionArguments} arg0
 * @returns {Array<string>}
 */
function getFilteredDbExtraSkill ({ db, filters }) {
	if (typeof filters === 'undefined') {
		return Object.keys(db);
	}

	const {
		keys = Object.keys(db),
		name = '',
	} = filters;
	const names = parseNameQuery(name);

	const fitsQuery = (key) => {
		/**
		 * @type {import('@bluuarc/bfmt-utilities/dist/datamine-types').IExtraSkill}
		 */
		const entry = db[key];
		const entryName = entry.name.toLowerCase();
		const description = entry.desc.toLowerCase();
		const normalizedKey = key.toString().toLowerCase();
		const fitsNameOrDescription = !name || names.some(n => entryName.includes(n) || description.includes(n));
		const fitsKey = !name || names.some(n => normalizedKey.includes(n));
		return [fitsNameOrDescription || fitsKey].every(v => v);
	};

	return keys.filter(key => db.hasOwnProperty(key) && fitsQuery(key));
}
mappingByType.set(DATA_MAPPING.extraSkills.key, getFilteredDbExtraSkill);

/**
 * @param {DbFilterFunctionArguments} arg0
 * @returns {Array<string>}
 */
function getFilteredDbBurst ({ db, filters }) {
	if (typeof filters === 'undefined') {
		return Object.keys(db);
	}

	const {
		keys = Object.keys(db),
		name = '',
	} = filters;
	const names = parseNameQuery(name);

	const fitsQuery = (key) => {
		/**
		 * @type {import('@bluuarc/bfmt-utilities/dist/datamine-types').IBraveBurst}
		 */
		const entry = db[key];
		const entryName = entry.name.toLowerCase();
		const description = entry.desc.toLowerCase();
		const normalizedKey = key.toString().toLowerCase();
		const fitsNameOrDescription = !name || names.some(n => entryName.includes(n) || description.includes(n));
		const fitsKey = !name || names.some(n => normalizedKey.includes(n));
		return [fitsNameOrDescription || fitsKey].every(v => v);
	};

	return keys.filter(key => db.hasOwnProperty(key) && fitsQuery(key));
}
mappingByType.set(DATA_MAPPING.bursts.key, getFilteredDbBurst);

export default mappingByType;

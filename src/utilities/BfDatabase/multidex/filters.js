import { DATA_MAPPING } from '@/utilities/constants';
import { getFullName } from '@/utilities/bf-core/units';
import { parseNameQuery } from './utils';

/**
 * @type {Map<string, function(): Array<string>}
 */
const mappingByType = new Map();

/**
 * @param {object} arg0
 * @param {[key: string]: object} arg0.db
 * @param {object} arg0.filters
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
		const entry = db[key];
		const fullName = getFullName(entry).toLowerCase();
		const strippedKey = key.toString().toLowerCase();
		const fitsName = !name || names.some(n => fullName.includes(n));
		const fitsKey = !name || names.some(n => strippedKey.includes(n));
		return [fitsName || fitsKey].every(v => v);
	};

	return keys.filter(key => db.hasOwnProperty(key) && fitsQuery(key));
}

mappingByType.set(DATA_MAPPING.units.key, getFilteredDbUnit);

export default mappingByType;

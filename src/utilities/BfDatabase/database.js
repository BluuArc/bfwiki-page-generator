import { SERVERS, SERVER_NAME_MAPPING } from '@/utilities/constants';
import dbFilters from './multidex/filters';
import dbInstance from './dexie-instance';
import dbSorts from './multidex/sorts';
import getLogger from '@/utilities/Logger';

const logger = getLogger('BfDatabase');
export class BfDatabase {
	constructor (inputDb = dbInstance, inputLogger = logger) {
		this._db = inputDb;
		this._logger = inputLogger;
	}

	/**
	 * @param {string} table
	 * @private
	 */
	_getTable (table) {
		return this._db.table(table);
	}

	/**
	 * @param {{table: string, data: any}}
	 * @returns {Promise<any>} Promise that resolves to key of input data entry
	 */
	put ({ table, data }) {
		return this._getTable(table).put(data);
	}

	/**
	 * @param {Object} arg0
	 * @param {string} arg0.table
	 * @param {object|string} arg0.key key can be either the primary key or an object
	 * @param {Array<string>?} arg0.props properties to return from the table entry; pass empty array or leave out to return everything
	 * @returns {Promise<any|undefined>} returns the first entry that matches the given key, otherwise returns undefined
	 */
	async get ({ table, key, props = [] }) {
		let result = await this._getTable(table).get(key);
		if (result && Array.isArray(props) && props.length > 0) {
			result = props.reduce((acc, prop) => {
				acc[prop] = result[prop];
				return acc;
			}, {});
		}
		return result;
	}

	/**
	 * @param {Object} arg0
	 * @param {string} arg0.table
	 * @param {Array<string>?} arg0.props properties to return from the table entry; pass empty array or leave out to return everything
	 * @returns {Promise<any[]>}
	 */
	getAll ({ table, props = [] }) {
		return Promise.resolve()
			.then(() => {
				/**
				 * @type {Promise<any[]>}
				 */
				return this._getTable(table).toArray();
			}).catch((err) => {
				logger.error('Error in getAll(). Defaulting to empty array.', { props, table }, err);
				return [];
			}).then((result) => {
				let resultingArray = (Array.isArray(result) && result) || [];
				if (resultingArray.length > 0 && Array.isArray(props) && props.length > 0) {
					resultingArray = resultingArray.map(entry => {
						return props.reduce((acc, prop) => {
							acc[prop] = entry[prop];
							return acc;
						}, {});
					});
				}
				return resultingArray;
			});
	}

	/**
	 * @param {Object} arg0
	 * @param {string} arg0.table
	 * @param {object|string} arg0.key key can be either the primary key or an object
	 * @returns {Promise<void>}
	 */
	delete ({ table, key }) {
		return this._getTable(table).delete(key);
	}

	/**
	 * @param {Array<{table: string, key: object|string}>} entries
	 * @returns {Promise<void>}
	 */
	deleteMultiple (entries) {
		return entries.reduce((acc, val) => {
			return acc.then(() => this.delete(val));
		}, Promise.resolve());
	}

	/**
	 * @param {Object} arg0
	 * @param {string} arg0.table
	 * @param {object|string} arg0.key key can be either the primary key or an object
	 * @returns {Promise<string[]>}
	 */
	async getDataKeys ({ table, key }) {
		const entry = await this.get({ key, props: ['data'], table });
		let keys = [];
		if (entry && entry.data) {
			keys = Object.keys(entry.data);
		}
		return keys;
	}

	get dbInstance () {
		return this._db;
	}

	/**
	 * @param {Object} arg0
	 * @param {string} arg0.table
	 * @param {Array<string>?} [arg0.keys=SERVERS] array of primary keys
	 * @returns {Promise<{[key: string]: Date}>}
	 */
	async getDateInformationForEntriesInTable ({ table, keys = SERVERS }) {
		const dbTable = this._getTable(table);
		const keyDateMapping = {};
		const getAllKeys = !Array.isArray(keys) || keys.length === 0;
		await dbTable.each(entry => {
			if (getAllKeys || keys.includes(entry.server)) {
				keyDateMapping[entry.server] = entry.cacheTime;
			}
		});
		return keyDateMapping;
	}

	/**
	 * @param {Array<{ table: string, keys: Array<string> }>} pairs
	 * @returns {Promise<{[pairKey: string]: Date}>}
	 */
	getDateInformationForTableKeyPairs (pairs = []) {
		const getDateInfoPromise = Promise.all(pairs.map(({ keys = SERVERS, table }) => {
			return this.getDateInformationForEntriesInTable({ keys, table })
				.then(entries => {
					return keys.map(key => ({ pairKey: `${table}-${key}`, value: entries[key] }))
						.filter(entry => !!entry.value);
				});
		}));
		return getDateInfoPromise.then(arraysOfEntries => {
			const result = {};
			arraysOfEntries.forEach(entriesArray => {
				entriesArray.forEach(({ pairKey, value }) => {
					result[pairKey] = value;
				});
			});
			return result;
		});
	}

	/**
	 * @param {object} arg0
	 * @param {Array<string>} arg0.extractedFields
	 * @param {object} arg0.filters
	 * @param {string?} arg0.server
	 * @param {object?} arg0.sortOptions
	 * @param {string} table
	 */
	async getFilteredDb ({
		extractedFields,
		filters,
		server = SERVER_NAME_MAPPING.Global,
		sortOptions,
		table,
	}) {
		const keysOnly = !Array.isArray(extractedFields);
		const { data: db } = await this.get({ key: server, props: ['data'], table });
		const filteredKeys = dbFilters.get(table)({ db, filters });
		logger.debug({ allKeys: Object.keys(db), filteredKeys, filters, server, table });
		if (keysOnly) {
			return typeof sortOptions === 'object'
				? dbSorts.get(table)({ db, keys: filteredKeys, sortOptions })
				: filteredKeys;
		} else {
			return filteredKeys.reduce((acc, key) => {
				const initialEntry = db[key];
				const filteredEntry = extractedFields.length === 0
					? initialEntry // get everything
					: extractedFields.reduce((entryAcc, fieldName) => {
						if (initialEntry && initialEntry[fieldName] !== undefined) {
							entryAcc[fieldName] = initialEntry[fieldName];
						}
						return entryAcc;
					}, {});

				acc[key] = filteredEntry;
				return acc;
			}, {});
		}
	}

	// TODO: getById and getByIds
}

export default new BfDatabase(dbInstance);

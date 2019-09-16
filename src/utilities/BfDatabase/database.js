import { SERVERS, SERVER_NAME_MAPPING } from '@/utilities/constants';
import { createPairKey } from './utils';
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
	 * @param {object} arg0
	 * @param {string?} arg0.server
	 * @param {string} arg0.table
	 * @returns {Promise<{ [key: string]: object }>}
	 * @private
	 */
	async _getDatamineDb ({ server, table }) {
		const { data: db } = await this.get({ key: server, props: ['data'], table });
		return db;
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
					return keys.map(server => ({ pairKey: createPairKey(table, server), value: entries[server] }))
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
	 * @param {Object} arg0
	 * @param {string} arg0.table
	 * @param {Array<string>?} [arg0.keys=SERVERS] array of primary keys
	 * @returns {Promise<Array<string>}
	 */
	async getCachedServersInTable ({ keys = SERVERS, table }) {
		const dbTable = this._getTable(table);
		const availableKeys = [];
		await dbTable.each(entry => {
			if (keys.includes(entry.server)) {
				availableKeys.push(entry.server);
			}
		});
		return availableKeys;
	}

	/**
	 * @param {Array<{ table: string, keys: Array<string> }>} pairs
	 * @returns {Promise<Array<string>>}
	 */
	getCachedServersInTables (pairs = []) {
		const getEntriesPromise = Promise.all(pairs.map(({ keys = SERVERS, table }) => {
			return this.getCachedServersInTable({ keys, table })
				.then(availableKeys => availableKeys.map(server => createPairKey(table, server)));
		}));
		return getEntriesPromise.then(arraysOfEntries => {
			return arraysOfEntries.reduce((acc, entriesArray) => acc.concat(entriesArray), []);
		});
	}

	/**
	 * @param {object} arg0
	 * @param {Array<string>} arg0.extractedFields
	 * @param {object} arg0.filters
	 * @param {object?} arg0.inputDb
	 * @param {boolean?} arg0.keysAndDb return the keys and database
	 * @param {string?} arg0.server
	 * @param {object?} arg0.sortOptions
	 * @param {string} arg0.table
	 */
	async getFilteredDb ({
		extractedFields,
		filters,
		inputDb,
		keysAndDb = false,
		server = SERVER_NAME_MAPPING.Global,
		sortOptions,
		table,
	}) {
		const keysOnly = !Array.isArray(extractedFields);
		const db = inputDb || await this._getDatamineDb({ server, table });
		const filteredKeys = dbFilters.get(table)({ db, filters });
		logger.debug({ allKeys: Object.keys(db), filteredKeys, filters, server, table });
		let resultingKeys = filteredKeys;
		if ((keysOnly || keysAndDb) && typeof sortOptions === 'object') {
			resultingKeys = dbSorts.get(table)({ db, keys: filteredKeys, sortOptions });
		}

		if (keysOnly) {
			return resultingKeys;
		} else {
			const filteredDb = filteredKeys.reduce((acc, key) => {
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

			return keysAndDb ? { db: filteredDb, keys: resultingKeys } : filteredDb;
		}
	}

	/**
	 * @param {object} arg0
	 * @param {object?} arg0.inputDb
	 * @param {Array<string>} arg0.keys
	 * @param {string?} arg0.server
	 * @param {object?} arg0.sortOptions
	 * @param {string} arg0.table
	 */
	async getSortedKeys ({
		inputDb,
		keys,
		server = SERVER_NAME_MAPPING.Global,
		sortOptions,
		table,
	}) {
		const db = inputDb || await this._getDatamineDb({ server, table });
		return dbSorts.get(table)({ db, keys, sortOptions });
	}

	/**
	 * @param {object} arg0
	 * @param {Array<string>?} arg0.extractedFields
	 * @param {Array<string>} arg0.ids
	 * @param {object?} arg0.inputDb
	 * @param {string?} arg0.server
	 * @param {string} arg0.table
	 * @returns {{ [key: string]: object }}
	 */
	async getByIds ({
		extractedFields = [],
		ids,
		inputDb,
		server,
		table,
	}) {
		const db = inputDb || await this._getDatamineDb({ server, table });
		const getEverything = extractedFields.length === 0;
		return ids.reduce((acc, id) => {
			const baseEntry = db[id];
			if (getEverything) {
				acc[id] = baseEntry;
			} else {
				const filteredEntry = extractedFields.reduce((entryAcc, field) => {
					if (baseEntry && baseEntry[field] !== undefined) {
						entryAcc[field] = baseEntry[field];
					}
					return entryAcc;
				}, {});
				acc[id] = filteredEntry;
			}
			return acc;
		}, {});
	}

	/**
	 * @param {object} arg0
	 * @param {Array<string>?} arg0.extractedFields
	 * @param {object?} arg0.inputDb
	 * @param {string} arg0.id
	 * @param {string?} arg0.server
	 * @param {string} arg0.table
	 */
	async getById ({
		extractedFields = [],
		id,
		inputDb,
		server,
		table,
	}) {
		const result = await this.getByIds({
			extractedFields,
			ids: [id],
			inputDb,
			server,
			table,
		});
		return result[id];
	}
}

export default new BfDatabase(dbInstance);

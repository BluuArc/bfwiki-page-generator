import dbInstance from './dexie-instance';
import getLogger from '@/utilities/Logger';

const logger = getLogger('BfDatabase');
export class BfDatabase {
	constructor (inputDb = dbInstance) {
		this._db = inputDb;
	}

	/**
	 * @param {{table: string, data: any}}
	 * @returns {Promise<any>} Promise that resolves to key of input data entry
	 */
	put ({ table, data }) {
		return this._db.table(table).put(data);
	}

	/**
	 * @param {Object} arg0
	 * @param {string} arg0.table
	 * @param {object|string} arg0.key key can be either the primary key or an object
	 * @param {Array<string>?} arg0.props properties to return from the table entry; pass empty array or leave out to return everything
	 * @returns {Promise<any|undefined>} returns the first entry that matches the given key, otherwise returns undefined
	 */
	async get ({ table, key, props = [] }) {
		let result = await this._db.table(table).get(key);
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
				return this._db.table(table).toArray();
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
		return this._db.table(table).delete(key);
	}

	/**
	 * @param {Object} arg0
	 * @param {string} arg0.table
	 * @param {object|string} arg0.key key can be either the primary key or an object
	 * @returns {Promise<string[]>}
	 */
	async getDataKeys ({ table, key }) {
		const dbTable = await this.get({ key, props: ['data'], table });
		let keys = [];
		if (dbTable && dbTable.data) {
			keys = Object.keys(dbTable.data);
		}
		return keys;
	}

	get dbInstance () {
		return this._db;
	}

	ping () {
		logger.debug('got ping', this);
		return 'pong';
	}

	// TODO: getById and getByIds
}

export default new BfDatabase(dbInstance);

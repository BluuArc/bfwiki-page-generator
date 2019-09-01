class WorkerStorage {
	constructor () {
		this._data = new Map();
	}

	/**
	 * @param {string} key
	 * @param {string} value
	 */
	setItem (key, value) {
		this._data.set(key, value);
	}

	/**
	 * @param {string} key
	 */
	getItem (key) {
		return this._data.get(key);
	}

	/**
	 * @param {string} key
	 */
	removeItem (key) {
		this._data.delete(key);
	}

	clear () {
		this._data.clear();
	}
}

export class LocalStorageStore {
	/**
	 * @param {string} scope
	 */
	constructor (scope = '') {
		this._scope = scope;

		/**
		 * @type {Map<*, Function(key: string, value: any)>}
		 */
		this._eventListeners = new Map();

		this._storage = self.localStorage || new WorkerStorage();
	}

	/**
	 * @param {string} key
	 */
	_makeScopedKey (key) {
		return `${this._scope}:${key}`;
	}

	/**
	 * @param {string} key
	 * @param {string|boolean|number} value
	 * @param {boolean} [useSynchronousEmit=false]
	 */
	storeValue (key, value, useSynchronousEmit = false) {
		this._storage.setItem(this._makeScopedKey(key), value);
		if (useSynchronousEmit) {
			this.emitValueChange(key, value);
		} else {
			this.delayedEmitValueChange(key, value);
		}
	}

	/**
	 * @param {string} key
	 * @param {object} value
	 * @param {boolean} [useSynchronousEmit=false]
	 */
	storeObject (key, value, useSynchronousEmit) {
		this._storage.setItem(this._makeScopedKey(key), JSON.stringify(value));
		if (useSynchronousEmit) {
			this.emitValueChange(key, value);
		} else {
			this.delayedEmitValueChange(key, value);
		}
	}

	/**
	 * @param {*} key
	 * @param {Function} fn
	 */
	addEventListener (key, fn) {
		if (typeof fn === 'function') {
			this._eventListeners.set(key, fn);
		}
	}

	removeEventListener (key) {
		return this._eventListeners.delete(key);
	}

	emitValueChange (keyOfValueChanged, newValue) {
		this._eventListeners.forEach((listener) => {
			listener(keyOfValueChanged, newValue);
		});
	}

	/**
	 * @returns {Promise<void>}
	 */
	delayedEmitValueChange (keyOfValueChanged, newValue, delay = 0) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				try {
					this.emitValueChange(keyOfValueChanged, newValue);
					resolve();
				} catch (err) {
					reject(err);
				}
			}, delay);
		});
	}

	/**
	 * @param {string} key
	 * @returns {boolean}
	 */
	getBoolean (key) {
		const value = this._storage.getItem(this._makeScopedKey(key));
		return value === 'true';
	}

	/**
	 * @param {string} key
	 * @returns {string}
	 */
	getString (key) {
		return this._storage.getItem(this._makeScopedKey(key)) || '';
	}
}

export default new LocalStorageStore('app');

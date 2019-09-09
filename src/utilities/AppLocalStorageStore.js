import {
	SERVERS,
	SERVER_NAME_MAPPING,
	SETTING_KEYS,
} from '@/utilities/constants';
import appInstance, { LocalStorageStore } from './LocalStorageStore'; // eslint-disable-line no-unused-vars

export class AppLocalStorageStore {
	/**
	 * @param {LocalStorageStore} store
	 */
	constructor (store = appInstance) {
		this._store = store;
	}

	get store () {
		return this._store;
	}

	get isDebugMode () {
		return this._store.getBoolean(SETTING_KEYS.DEBUG_MODE);
	}

	set isDebugMode (isDebugMode) {
		this._store.storeValue(SETTING_KEYS.DEBUG_MODE, isDebugMode);
	}

	get useLightTheme () {
		return this._store.getBoolean(SETTING_KEYS.USE_LIGHT_THEME);
	}

	set useLightTheme (useLightTheme) {
		this._store.storeValue(SETTING_KEYS.USE_LIGHT_THEME, useLightTheme);
	}

	get serverIndex () {
		const serverIndex = SERVERS.indexOf(this.serverName);
		return serverIndex > -1 ? serverIndex : 0;
	}

	get serverName () {
		return this._store.getString(SETTING_KEYS.DEFAULT_SERVER) || SERVER_NAME_MAPPING.Global;
	}

	set serverName (server) {
		this._store.storeValue(SETTING_KEYS.DEFAULT_SERVER, server);
	}

	/**
	 * @param {string} server
	 */
	getUrlForServer (server) {
		const key = `${SETTING_KEYS.BASE_CONTENT_URL}${server}`;
		return this._store.getString(key);
	}

	/**
	 * @param {string} server
	 */
	setUrlForServer (server, url) {
		const key = `${SETTING_KEYS.BASE_CONTENT_URL}${server}`;
		return this._store.storeValue(key, url);
	}
}

export default new AppLocalStorageStore(appInstance);

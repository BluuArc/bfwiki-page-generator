import {
	SERVERS,
	SERVER_NAME_MAPPING,
	SETTING_KEYS,
} from '@/utilities/constants';
import appInstance, { LocalStorageStore } from './LocalStorageStore'; // eslint-disable-line no-unused-vars

export default appInstance;

/**
 * @param {LocalStorageStore} instance
 */
export function isDebugMode (instance = appInstance) {
	return instance.getBoolean('debugMode');
}

/**
 * @param {LocalStorageStore} instance
 */
export function getStoredThemeValue (instance = appInstance) {
	return instance.getBoolean(SETTING_KEYS.USE_LIGHT_THEME);
}

/**
 * @param {LocalStorageStore} instance
 */
export function getStoredServerIndex (instance = appInstance) {
	const serverName = instance.getString(SETTING_KEYS.DEFAULT_SERVER);
	const serverIndex = SERVERS.indexOf(serverName);
	return serverIndex > -1 ? serverIndex : 0;
}

/**
 * @param {LocalStorageStore} instance
 */
export function getStoredServerName (instance = appInstance) {
	return instance.getString(SETTING_KEYS.DEFAULT_SERVER) || SERVER_NAME_MAPPING.Global;
}

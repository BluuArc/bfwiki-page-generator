/**
 * @param {string} tableName Name of the data table (e.g. units)
 * @param {string} server
 */
export function createPairKey (tableName, server) {
	return `${tableName}-${server}`;
}

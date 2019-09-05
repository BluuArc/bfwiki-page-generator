/**
 * @param {string} tableName Name of the data table (e.g. units)
 * @param {string} server
 */
export function createPairKey (tableName, server) {
	return `${tableName}-${server}`;
}

/**
 * @param {string} key
 * @returns {{ table: string, server: string }}
 */
export function parsePairKey (key) {
	const [table, server] = key.split('-');
	return { server, table };
}

/**
 * Pair of `[key, value]`
 * @typedef {[string, string]} WikiDataPair
 */

/**
 * @param {Array<WikiDataPair>} pairs
 */
export function generateTemplateBody (pairs) {
	const longestKey = pairs.reduce((acc, pair) => Math.max(acc, pair[0].length), 0);

	return pairs
		.map(([key, value]) => `${key.padEnd(longestKey, ' ')} = ${value}`)
		.join('\n');
}

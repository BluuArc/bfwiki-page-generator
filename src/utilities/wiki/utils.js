/**
 * Pair of `[key, value]`
 * @typedef {[string, string]} WikiDataPair
 */

/**
 * @param {Array<WikiDataPair>} pairs
 */
export function generateTemplateBody (pairs) {
	const longestKeyLength = pairs.reduce((acc, pair) => Math.max(acc, pair[0].length), 0);

	/**
	 * @param {string} str
	 * @param {number} intendedLength
	 * @param {string} fillerCharacter
	 */
	const padEnd = (str, intendedLength, fillerCharacter) => {
		const spacesToFill = intendedLength - str.length;
		return `${str}${new Array(spacesToFill).fill(fillerCharacter).join('')}`;
	};

	return pairs
		.map(([key, value]) => `${padEnd(key, longestKeyLength, ' ')} = ${value}`)
		.join('\n');
}

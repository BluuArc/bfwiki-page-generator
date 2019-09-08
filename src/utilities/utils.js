/**
 * @returns {string}
 */
export function getRandomToken () {
	return `${Date.now()}-${Math.random()}`;
}

/**
 * @param {any} value
 * @param {number?} [defaultValue=0]
 */
export function getNumberOrDefault (value, defaultValue = 0) {
	return !isNaN(value) ? +value : defaultValue;
}

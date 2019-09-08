/**
 * @returns {string}
 */
export function getRandomToken () {
	return `${Date.now()}-${Math.random()}`;
}

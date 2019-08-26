/**
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export function stringCompare (a, b) {
	return a < b ? -1 : 1;
}

/**
 * Determines if 2 input arrays have the same items (order-agnostic)
 * @param {Array<any>} a
 * @param {Array<any>} b
 * @returns {boolean}
 */
export function arraysAreIdentical (a, b) {
	let isIdentical = false;
	if (a.length === b.length) {
		isIdentical = a.length === 0 ||
			(
				a.every(valueInA => b.includes(valueInA)) &&
				b.every(valueInB => a.includes(valueInB))
			);
	}
	return isIdentical;
}

/**
 * Convert a search query for a name into multiple queries
 * @param {string} input
 * @returns {Array<string>}
 */
export function parseNameQuery (input) {
	return input.split('|')
		.filter((v, i) => i === 0 || v.trim()) // keep first entry and non-empty-string entries
		.map(n => n.toLowerCase());
}

/**
 * @desc Each sort returns a numerical result. (i.e. positive = idA should go after idB when sorting in ascending order)
 */
export const commonSorts = Object.freeze({
	Alphabetical: (idA, idB, nameGetter) => {
		const [nameA, nameB] = [nameGetter(idA), nameGetter(idB)];
		return (nameA > nameB) ? 1 : -1;
	},
	ID: (idA, idB) => +idA - +idB,
	Numerical: (idA, idB, numberGetter) => {
		const [numA, numB] = [numberGetter(idA), numberGetter(idB)];
		return (numA !== numB) ? (numA - numB) : commonSorts.ID(idA, idB);
	},
});

/**
 * @param {object} arg0
 * @param {Array<any>} arg0.input
 * @param {function(): number} arg0.sortFn
 * @param {boolean} arg0.isAscending
 */
export function applySorts ({ input, sortFn = commonSorts.ID, isAscending = true }) {
	return input.sort((a, b) => {
		const result = sortFn(a, b);
		return isAscending ? result : -result;
	});
}

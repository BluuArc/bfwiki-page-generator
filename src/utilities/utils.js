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

/**
 * @param {string} input
 */
export function toKebabCase (input) {
	return input.toLowerCase().replace(/ /g, '-');
}

/**
 * @param {Function} fn
 * @param {number?} delay
 */
export function debounce (fn, delay = 100) {
	let currentTimeout;
	const outputFunction = function (...args) {
		if (currentTimeout) {
			clearTimeout(currentTimeout);
		}
		currentTimeout = setTimeout(() => {
			fn.apply(this, args);
			currentTimeout = null;
		}, delay);
	};

	outputFunction.cancel = () => {
		if (currentTimeout) {
			clearTimeout(currentTimeout);
		}
	};

	return outputFunction;
}

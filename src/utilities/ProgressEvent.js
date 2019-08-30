
/**
 * @param {number} loaded
 * @param {number} total
 * @returns {ProgressEvent}
 */
export default function makeProgressEvent (loaded, total) {
	return Object.freeze({ loaded, total });
}

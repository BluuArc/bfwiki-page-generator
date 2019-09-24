/**
 * @param {string} baseContentUrl
 * @param {string} thumbnailUrl
 */
export function getImageUrl (baseContentUrl, thumbnailUrl) {
	return `${baseContentUrl}/item/${thumbnailUrl}`;
}

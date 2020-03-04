import { getItemImageUrl } from '@bluuarc/bfmt-utilities/dist/items';

/**
 * @param {string} baseContentUrl
 * @param {string} thumbnailUrl
 */
export function getImageUrl (baseContentUrl, thumbnailUrl) {
	return getItemImageUrl(baseContentUrl, thumbnailUrl);
}

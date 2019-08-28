import { BASE_DATAMINE_URL, DATA_MAPPING, SERVERS, SERVER_NAME_MAPPING } from '@/utilities/constants';
import bfDatabase from '../database';
import getLogger from '@/utilities/Logger';

const logger = getLogger('DownloadHelpers');

/**
 * @param {string} server
 * @param {string} fileName
 * @returns {string}
 */
function generateDownloadUrl (server, fileName) {
	const endUrl = server === SERVER_NAME_MAPPING.Global
		? fileName
		: `${server.toLowerCase()}/${fileName}`;
	return `${BASE_DATAMINE_URL}/${endUrl}`;
}

/**
 * @param {string} url
 * @returns {Promise<object>}
 */
function downloadJson (url) {
	return fetch(url)
		.then(r => r.ok
			? r.json()
			: Promise.reject(new Error(`[${r.status}]: ${r.statusText}`))
		);
}

/**
 * @param {Array<string>} urls
 * @returns {Promise<object>}
 */
function downloadToSingleObject (urls = []) {
	const downloadUrl = (url) => downloadJson(url)
		.catch(err => {
			logger.error('Error downloading data. Defaulting to empty object.', { url }, err);
			return {};
		});

	return Promise.all(urls.map(downloadUrl))
		.then((...results) => {
			return results.reduce((acc, val) => {
				Object.keys(val).forEach(key => {
					acc[key] = val;
				});
				return acc;
			}, {});
		});
}

/**
 * @param {object} arg0
 * @param {object} arg0.data
 * @param {string} arg0.server
 * @param {string} arg0.table name of the table
 * @param {Date} arg0.cacheTime
 * @returns {Promise<string>} key of the stored data
 */
function storeDataIntoTable ({ data, server, table, cacheTime = new Date() }) {
	return bfDatabase.put({
		data: {
			cacheTime,
			data,
			server,
		},
		table,
	});
}

/**
 * @param {object} arg0
 * @param {string} arg0.server
 * @param {string} arg0.key the key of the entry inside the DATA_MAPPING constant
 */
export default function downloadDataForServerAndKey ({ server, key }) {
	if (!SERVERS.includes(server)) {
		throw new Error(`Server [${server}] is not a valid server.`);
	} else if (!DATA_MAPPING.hasOwnProperty(key)) {
		throw new Error(`Input key [${key}] is not valid.`);
	}

	// TODO: pass in observer for progress tracking

	/**
	 * @type {Array<string>}
	 */
	const mappedUrls = DATA_MAPPING[key].files.map(url => generateDownloadUrl(server, url));
	logger.debug('Starting download for input', { key, mappedUrls, server });
	return downloadToSingleObject(mappedUrls)
		.then(data => storeDataIntoTable({ data, server, table: key }));
}

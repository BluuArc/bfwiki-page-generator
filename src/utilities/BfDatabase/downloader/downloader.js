import { BASE_DATAMINE_URL, DATA_MAPPING, SERVERS, SERVER_NAME_MAPPING } from '@/utilities/constants';
import { Observable, Subject } from 'threads/observable';
import bfDatabase from '../database';
import getLogger from '@/utilities/Logger';
import makeProgressEvent from '@/utilities/ProgressEvent';

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
 * @param {function(current: number, total: number): void} onProgress
 * @returns {Promise<object>}
 */
function downloadToSingleObject (urls = [], onProgress) {
	let currentStep = 0;
	const totalSteps = urls.length + 1; // download + step to combine
	const incrementStep = () => onProgress(++currentStep, totalSteps);
	const downloadUrl = (url) => downloadJson(url)
		.catch(err => {
			logger.error('Error downloading data. Defaulting to empty object.', { url }, err);
			return {};
		})
		.then(result => {
			incrementStep();
			return result;
		});

	return Promise.all(urls.map(downloadUrl))
		.then((results) => {
			incrementStep();
			const data = results.reduce((acc, val) => {
				Object.keys(val).forEach(key => {
					acc[key] = val;
				});
				return acc;
			}, {});
			logger.debug('Keys in downloaded data', Object.keys(data).length);
			return data;
		});
}

/**
 * @param {object} arg0
 * @param {Date} arg0.cacheTime
 * @param {object} arg0.data
 * @param {string} arg0.server
 * @param {string} arg0.table name of the table
 * @returns {Promise<string>} key of the stored data
 */
function storeDataIntoTable ({ cacheTime = new Date(), data, server, table }) {
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
 * @param {string} arg0.key the key of the entry inside the DATA_MAPPING constant
 * @param {string} arg0.server
 * @param {Promise<string>}
 */
function downloadDataForServerAndKey ({ key, server, subject }) {
	if (!SERVERS.includes(server)) {
		throw new Error(`Server [${server}] is not a valid server.`);
	} else if (!DATA_MAPPING.hasOwnProperty(key)) {
		throw new Error(`Input key [${key}] is not valid.`);
	}

	/**
	 * @type {{files: Array<string>, name: string}}
	 */
	const dataConfig = DATA_MAPPING[key];
	/**
	 * @type {Array<string>}
	 */
	const mappedUrls = dataConfig.files.map(url => generateDownloadUrl(server, url));
	const totalSteps = mappedUrls.length + 2; // download + combine + store
	const baseProgressConfig = {
		message: `Downloading data for ${dataConfig.name}`,
		name: dataConfig.name,
	};
	logger.debug('Starting download for input', { key, mappedUrls, server });
	subject.next({
		...baseProgressConfig,
		...makeProgressEvent(1, totalSteps),
	});

	return downloadToSingleObject(mappedUrls, (step) => {
		subject.next({
			...baseProgressConfig,
			...makeProgressEvent(step, totalSteps),
		});
	}).then((data) => {
		subject.next({
			...baseProgressConfig,
			...makeProgressEvent(totalSteps, totalSteps),
			message: `Storing data for ${dataConfig.name}`,
		});
		return storeDataIntoTable({ data, server, table: key });
	});
}

/**
 * @param {Array<{ server: string, key: string }>} entries
 */
export default function downloadMultipleDataEntries (entries) {
	const subject = new Subject();
	bfDatabase.dbInstance.open().then(() => {
		return entries.reduce((acc, { key, server }) => {
			return acc.then(() => downloadDataForServerAndKey({ key, server, subject }));
		}, Promise.resolve());
	}).catch(e => {
		subject.error(e);
	}).finally(() => {
		bfDatabase.dbInstance.close();
		subject.complete();
	});

	return Observable.from(subject);
}

import { Observable, Subject } from 'threads/observable';
import bfDatabase, { BfDatabase } from './database'; // eslint-disable-line sort-imports
import { convertClassInstanceToObject } from '@/utilities/worker-helper';
import { expose } from 'threads/worker';

class ThreadsBfDatabase extends BfDatabase {
	/**
	 * Wrapper method around bfDatabase.getDataKeys to stream larger key arrays
	 * @param {Object} arg0
	 * @param {object|string} arg0.key key can be either the primary key or an object
	 * @param {string} arg0.table
	 * @param {number?} arg0.sliceSize the max size of each portion array passed in through the stream
	 */
	getDataKeysStream ({ key, table, sliceSize = 10 }) {
		const subject = new Subject();
		this.getDataKeys({ key, table })
			.then(dataKeys => {
				const steps = Math.ceil(dataKeys.length / sliceSize);
				for (let i = 0; i < steps; ++i) {
					const startIndex = i * sliceSize;
					subject.next({
						data: dataKeys.slice(startIndex, startIndex + sliceSize),
						stepsRemaining: steps - (i + 1),
					});
				}
			}).catch(e => {
				this._logger.error(e);
				subject.error(e);
			}).finally(() => {
				subject.complete();
			});

		return Observable.from(subject);
	}
}

expose(convertClassInstanceToObject(new ThreadsBfDatabase(bfDatabase.dbInstance)));

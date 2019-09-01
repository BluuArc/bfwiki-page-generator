import { Worker, spawn } from 'threads';

export default function makeWorker () {
	return spawn(new Worker('./index.worker.js'));
}

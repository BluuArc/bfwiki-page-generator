import { Worker, spawn } from 'threads';

export default spawn(new Worker('./index.worker.js'));

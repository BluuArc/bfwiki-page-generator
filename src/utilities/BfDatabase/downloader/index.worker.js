import downloader from './downloader';
import { expose } from 'threads/worker';

expose(downloader);

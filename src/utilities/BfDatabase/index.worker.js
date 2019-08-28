import bfDatabase from './database';
import { convertClassInstanceToObject } from '@/utilities/worker-helper';
import { expose } from 'threads/worker';

expose(convertClassInstanceToObject(bfDatabase));

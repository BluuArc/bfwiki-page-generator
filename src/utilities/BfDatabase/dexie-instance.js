import { DATA_MAPPING } from '@/utilities/constants';
import Dexie from 'dexie';

const db = new Dexie('bfwiki-page-generator');
const DEFAULT_SCHEMAS = {
	1: '&server,cacheTime',
};

const tableMapping = Object.keys(DATA_MAPPING).reduce((acc, key) => {
	acc[key] = DEFAULT_SCHEMAS[1];
	return acc;
}, {});

db.version(1).stores(tableMapping);

export default db;

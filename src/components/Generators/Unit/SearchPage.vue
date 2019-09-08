<template>
	<search-page-base
		:getDataKey="getDataKey"
		:getFilteredData="getFilteredData"
		:getSortedData="getSortedData"
		:sortNames="sortNames"
	>
	</search-page-base>
</template>

<script>
import { DATA_MAPPING } from '@/utilities/constants';
import SearchPageBase from '../SearchPageBase';
import bfDatabase from '@/utilities/BfDatabase/index.client';
import getLogger from '@/utilities/Logger';
import { getStoredServerName } from '@/utilities/LocalStorageStoreInstance';

const UNIT_FIELDS = ['id', 'name', 'guide_id', 'rarity', 'element'];
const logger = getLogger('UnitSearchPage');
export default {
	components: {
		SearchPageBase,
	},
	computed: {
		sortNames: () => ['Unit ID', 'Alphabetical', 'Elements', 'Guide ID', 'Rarity'],
	},
	data () {
		return {
			filteredDb: {},
		};
	},
	methods: {
		getDataKey (entry) {
			return entry; // each entry is a unit ID
		},
		getFilteredData (filters, sortOptions) {
			const server = getStoredServerName();
			const table = DATA_MAPPING.units.key;
			return bfDatabase.then(worker => {
				return worker.getFilteredDb({
					extractedFields: UNIT_FIELDS,
					filters,
					keysAndDb: true,
					server,
					sortOptions,
					table,
				}).then(({ db, keys }) => {
					this.filteredDb = db;
					logger.debug('result keys', { filters, keys, sortOptions });
					return keys.filter(k => k !== '1');
				});
			});
		},
		getSortedData (filteredKeys, sortOptions) {
			return bfDatabase.then(worker => {
				return worker.getSortedKeys({
					keys: filteredKeys,
					server: getStoredServerName(),
					sortOptions,
					table: DATA_MAPPING.units.key,
				});
			});
		},
	},
};
</script>

<template>
	<table-checker :expectedTables="expectedTables" style="height: 100%;">
		<search-page/>
	</table-checker>
</template>

<script>
import { DATA_MAPPING, EXPECTED_TABLE_MAPPING, SERVER_NAME_MAPPING } from '@/utilities/constants';
import SearchPage from '@/components/Generators/Items/SearchPage';
import TableChecker from '@/components/utilities/TableChecker';
import appLocalStorageStore from '@/utilities/AppLocalStorageStore';

export default {
	components: {
		SearchPage,
		TableChecker,
	},
	computed: {
		expectedTables: () => {
			let tables = EXPECTED_TABLE_MAPPING[DATA_MAPPING.items.key].slice();
			if (appLocalStorageStore.serverName !== SERVER_NAME_MAPPING.Global) {
				tables = tables.filter(t => t !== DATA_MAPPING.dictionary.key);
			}
			return tables;
		},
	},
	name: 'SearchItems',
};
</script>

<template>
	<table-checker :expectedTables="expectedTables" style="height: 100%;">
		<view-page/>
	</table-checker>
</template>

<script>
import { DATA_MAPPING, EXPECTED_TABLE_MAPPING, SERVER_NAME_MAPPING } from '@/utilities/constants';
import TableChecker from '@/components/utilities/TableChecker';
import ViewPage from '@/components/Generators/Items/ViewPage';
import appLocalStorageStore from '@/utilities/AppLocalStorageStore';

export default {
	components: {
		TableChecker,
		ViewPage,
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
};
</script>

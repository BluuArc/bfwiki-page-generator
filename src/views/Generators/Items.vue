<template>
	<table-checker :expectedTables="expectedTables" style="height: 100%;">
		<search-page/>
	</table-checker>
</template>

<script>
import { DATA_MAPPING, EXPECTED_TABLE_MAPPING } from '@/utilities/constants';
import SearchPage from '@/components/Generators/Items/SearchPage';
import TableChecker from '@/components/utilities/TableChecker';

export default {
	components: {
		SearchPage,
		TableChecker,
	},
	computed: {
		expectedTables: () => EXPECTED_TABLE_MAPPING[DATA_MAPPING.items.key].slice(),
	},
};
</script>

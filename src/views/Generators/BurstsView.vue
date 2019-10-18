<template>
	<table-checker :expectedTables="expectedTables" style="height: 100%;">
		<view-page/>
	</table-checker>
</template>

<script>
import { DATA_MAPPING, EXPECTED_TABLE_MAPPING } from '@/utilities/constants';
import TableChecker from '@/components/utilities/TableChecker';
import ViewPage from '@/components/Generators/Bursts/ViewPage';
export default {
	components: {
		TableChecker,
		ViewPage,
	},
	computed: {
		expectedTables: () => EXPECTED_TABLE_MAPPING[DATA_MAPPING.bursts.key].slice(),
	},
};
</script>

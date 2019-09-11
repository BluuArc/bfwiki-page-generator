<template>
	<table-checker :expectedTables="expectedTables" style="height: 100%;">
		<view-page/>
	</table-checker>
</template>

<script>
import { DATA_MAPPING } from '@/utilities/constants';
import TableChecker from '@/components/utilities/TableChecker';
import ViewPage from '@/components/Generators/Unit/ViewPage';
export default {
	components: {
		TableChecker,
		ViewPage,
	},
	computed: {
		expectedTables: () => [
			// TODO: refactor into data mapping constant?
			// TODO: update with items and uncomment when parsing ES is implemented?
			DATA_MAPPING.units.key,
			DATA_MAPPING.spEnhancements.key,
			// DATA_MAPPING.dictionary.key,
			// DATA_MAPPING.evolutionMaterials.key,
		],
	},
};
</script>

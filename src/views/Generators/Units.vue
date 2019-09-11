<template>
	<table-checker :expectedTables="expectedTables" style="height: 100%;">
		<search-page/>
	</table-checker>
</template>

<script>
import { DATA_MAPPING } from '@/utilities/constants';
import SearchPage from '@/components/Generators/Unit/SearchPage';
import TableChecker from '@/components/utilities/TableChecker';

export default {
	components: {
		SearchPage,
		TableChecker,
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

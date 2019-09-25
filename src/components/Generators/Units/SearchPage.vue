<template>
	<search-page-base
		:getDataKey="getDataKey"
		:getFilteredData="getFilteredData"
		:getSortedData="getSortedData"
		:sortNames="sortNames"
	>
		<template v-slot:result="{ data }">
			<ul class="unit-results-list">
				<li v-for="entryId in data" :key="getDataKey(entryId)">
					<list-card
						:to="getEntryLink(entryId)"
						:entry="filteredDb[entryId]"
					/>
				</li>
			</ul>
		</template>
	</search-page-base>
</template>

<script>
import { DATA_MAPPING } from '@/utilities/constants';
import ListCard from '@/components/BF/Units/ListCard';
import SearchPageBase from '../SearchPageBase';
import appLocalStorageStore from '@/utilities/AppLocalStorageStore';
import bfDatabase from '@/utilities/BfDatabase/index.client';
import getLogger from '@/utilities/Logger';

const UNIT_FIELDS = ['id', 'name', 'guide_id', 'rarity', 'element'];
const logger = getLogger('UnitSearchPage');
export default {
	components: {
		ListCard,
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
		getEntryLink (entry) {
			return `${this.$route.path}/${entry}`;
		},
		getFilteredData (filters, sortOptions) {
			const server = appLocalStorageStore.serverName;
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
					server: appLocalStorageStore.serverName,
					sortOptions,
					table: DATA_MAPPING.units.key,
				});
			});
		},
	},
};
</script>

<style lang="scss">
@import "@/styles/util-mixins.scss";

ul.unit-results-list {
	@include list-style-reset();

	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
	grid-gap: 0.5em;
}
</style>

<template>
	<search-page-base
		:getDataKey="getDataKey"
		:getFilteredData="getFilteredData"
		:getSortedData="getSortedData"
		:sortNames="sortNames"
	>
		<template v-slot:result="{ data }">
			<ul class="item-results-list">
				<li v-for="entryId in data" :key="getDataKey(entryId)">
					<list-card
            style="height: 100%;"
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
import ListCard from '@/components/BF/Items/ListCard';
import SearchPageBase from '../SearchPageBase';
import appLocalStorageStore from '@/utilities/AppLocalStorageStore';
import bfDatabase from '@/utilities/BfDatabase/index.client';
import getLogger from '@/utilities/Logger';

const ITEM_FIELDS = ['id', 'name', 'thumbnail', 'rarity', 'type', 'desc', 'sphere type', 'raid'];
const logger = getLogger('ItemSearchPage');
export default {
	components: {
		ListCard,
		SearchPageBase,
	},
	computed: {
		sortNames: () => ['Item ID', 'Alphabetical', 'Type', 'Rarity'],
	},
	data () {
		return {
			filteredDb: {},
		};
	},
	methods: {
		getDataKey (entry) {
			return entry; // each entry is an item ID
		},
		getEntryLink (entry) {
			return `${this.$route.path}/${entry}`;
		},
		getFilteredData (filters, sortOptions) {
			const server = appLocalStorageStore.serverName;
			const table = DATA_MAPPING.items.key;
			return bfDatabase.then(worker => {
				return worker.getFilteredDb({
					extractedFields: ITEM_FIELDS,
					filters,
					keysAndDb: true,
					server,
					sortOptions,
					table,
				}).then(({ db, keys }) => {
					this.filteredDb = db;
					logger.debug('result keys', { filters, keys, sortOptions });
					return keys;
				});
			});
		},
		getSortedData (filteredKeys, sortOptions) {
			return bfDatabase.then(worker => {
				return worker.getSortedKeys({
					keys: filteredKeys,
					server: appLocalStorageStore.serverName,
					sortOptions,
					table: DATA_MAPPING.items.key,
				});
			});
		},
	},
};
</script>

<style lang="scss">
@import "@/styles/util-mixins.scss";

ul.item-results-list {
	@include list-style-reset();

	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
	grid-gap: 0.5em;
}
</style>

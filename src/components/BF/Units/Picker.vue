<template>
	<search-page-base
		:getDataKey="getDataKey"
		:getFilteredData="getFilteredData"
		:getSortedData="getSortedData"
		:sortNames="sortNames"
		:removeTopOffset="removeTopOffset"
	>
		<template v-slot:result="{ data }">
			<ul class="unit-results-list">
				<li v-for="entryId in data" :key="getDataKey(entryId)">
					<list-card
						v-if="useLinkRedirect"
						:to="getEntryLink(entryId) || undefined"
						:entry="filteredDb[entryId]"
					/>
					<list-card
						v-else
						@click.native="() => emitSelection(entryId, filteredDb[entryId])"
						:entry="filteredDb[entryId]"
					/>
				</li>
			</ul>
		</template>
	</search-page-base>
</template>

<script>
import { DATA_MAPPING } from '@/utilities/constants';
import ListCard from './ListCard';
import PickerMixin from '../PickerMixin';
import SearchPageBase from '../SearchPageBase';
import getLogger from '@/utilities/Logger';

const UNIT_FIELDS = ['id', 'name', 'guide_id', 'rarity', 'element'];
const logger = getLogger('UnitPicker');
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
		getFilteredData (filters, sortOptions) {
			return this.getFilteredDataForOptions({
				extractedFields: UNIT_FIELDS,
				filters,
				logger,
				sortOptions,
				table: DATA_MAPPING.units.key,
			}).then(keys => keys.filter(k => k !== '1'));
		},
		getSortedData (filteredKeys, sortOptions) {
			return this.getSortedDataForOptions({
				filteredKeys,
				logger,
				sortOptions,
				table: DATA_MAPPING.units.key,
			});
		},
	},
	mixins: [PickerMixin],
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

<template>
	<section class="search-area">
		<v-card flat :loading="loading">
			<v-container fluid>
				<v-layout align-baseline>
					<v-flex>
						<v-text-field
							class="pr-2"
							label="Search"
							:hint="searchMessage"
							@keydown.enter="emitSearchChange"
							v-model="filters.name"
							persistent-hint
						/>
					</v-flex>
					<v-flex style="flex: none">
						<v-btn
							class="mx-2"
							style="transition: 0.25s ease background-color"
							small
							fab
							:color="hasDirtyInput ? 'primary' : undefined"
							:text="!hasDirtyInput"
							@click="emitSearchChange">
							<v-icon>fa-search</v-icon>
						</v-btn>
					</v-flex>
				</v-layout>
				<v-layout class="mt-2">
					<v-flex style="flex: 0" v-if="filterNames.length >= 1">
						<v-btn small rounded text @click="filterSortSheetExpansions = [0]">
							<v-icon left small>fa-filter</v-icon>
							Filter
						</v-btn>
					</v-flex>
					<v-spacer/>
					<v-flex style="flex: 0">
						<v-btn
							small rounded text
							@click="filterSortSheetExpansions = [sortExpansionPanelIndex]"
						>
							Sort {{ inputSort.type }} <v-icon right small>{{ getSortDirectionIcon(inputSort.isAscending) }}</v-icon>
						</v-btn>
					</v-flex>
					<v-bottom-sheet v-model="showFilterSortSheet" inset persistent>
						<v-sheet>
							<v-expansion-panels accordion multiple v-model="filterSortSheetExpansions">
								<v-expansion-panel v-if="filterNames.length >= 1">
									<v-expansion-panel-header>
										Filter
									</v-expansion-panel-header>
									<v-expansion-panel-content>
										<v-container fluid>
											<v-layout v-for="name in filterNames" :key="name">
												<slot :name="`filter-${name}`" :filters="filters">
													This is the filter area for {{ name }}
												</slot>
											</v-layout>
										</v-container>
									</v-expansion-panel-content>
								</v-expansion-panel>
								<v-expansion-panel>
									<v-expansion-panel-header v-slot="{ open }">
										<v-layout align-baseline>
											<span>Sort</span>
											<v-chip outlined class="mx-2" v-if="!open">
												{{ sort.type }}
												<v-icon right small>{{ getSortDirectionIcon(sort.isAscending) }}</v-icon>
											</v-chip>
										</v-layout>
									</v-expansion-panel-header>
									<v-expansion-panel-content>
										<v-layout column>
											<v-flex>
												<v-autocomplete
													v-model="sort.type"
													label="Type"
													:items="sortNames"
													:item-color="$vuetify.theme.dark ? 'white' : 'black'"
												/>
											</v-flex>
											<v-flex>
												<v-switch
													v-model="sort.isAscending"
													color="grey lighten-1"
													class="sort-order-switch"
												>
													<template v-slot:label>
														<v-label>
															<v-icon left>{{ getSortDirectionIcon(sort.isAscending) }}</v-icon>
															{{ sortDirectionLabel }}
														</v-label>
													</template>
												</v-switch>
											</v-flex>
										</v-layout>
									</v-expansion-panel-content>
								</v-expansion-panel>
							</v-expansion-panels>
							<v-layout class="py-2 pr-2">
								<v-spacer/>
								<v-btn
									class="ma-2"
									:outlined="!hasDirtyInput"
									:color="hasDirtyInput ? 'primary' : undefined"
									@click="onFilterSortAccept"
								>
									Save
								</v-btn>
								<v-btn
									class="ma-2"
									text
									@click="onFilterSortCancel"
								>
									Cancel
								</v-btn>
							</v-layout>
						</v-sheet>
					</v-bottom-sheet>
				</v-layout>
				<slot name="bottom"/>
			</v-container>
		</v-card>
	</section>
</template>

<script>
import getLogger from '@/utilities/Logger';

const logger = getLogger('SearchArea');
export default {
	computed: {
		hasChangedFilters () {
			// TODO: handle other types of filters
			return this.filters.name !== this.inputFilters.name;
		},
		hasChangedSorts () {
			return this.sort.isAscending !== this.inputSort.isAscending ||
				this.sort.type !== this.inputSort.type;
		},
		hasDirtyInput () {
			return this.hasChangedSorts || this.hasChangedFilters;
		},
		inputFilters () {
			return this.value.filters || {
				name: '',
			};
		},
		inputSort () {
			return this.value.sort || {
				isAscending: true,
				type: 'ID',
			};
		},
		searchMessage () {
			return [
				`${this.resultCount} results.`,
				this.hasDirtyInput ? 'Press search button to apply filters.' : '',
			].join(' ');
		},
		sortDirectionLabel () {
			return `${this.sort.isAscending ? 'Ascending' : 'Descending'} Order`;
		},
		sortExpansionPanelIndex () {
			return this.filterNames.length >= 1 ? 1 : 0;
		},
	},
	created () {
		this.cleanInput();
	},
	data () {
		return {
			filterSortSheetExpansions: [],
			filters: {
				name: '',
			},
			showFilterSortSheet: false,
			sort: {
				isAscending: false,
				type: 'ID',
			},
		};
	},
	methods: {
		cleanInput () {
			// TODO: proper deep clone
			this.filters = { ...this.inputFilters };
			this.setSortValue(this.inputSort);
		},
		emitSearchChange () {
			const { hasChangedFilters, hasChangedSorts, filters, sort } = this;
			let resultToEmit;
			if (hasChangedFilters && hasChangedSorts) {
				resultToEmit = { filters, sort };
			} else if (hasChangedFilters) {
				resultToEmit = { filters };
			} else if (hasChangedSorts) {
				resultToEmit = { sort };
			}

			if (resultToEmit) {
				logger.debug('emitting changed input', resultToEmit);
				this.$emit('change', resultToEmit);
			}
		},
		getSortDirectionIcon (isAscending) {
			return isAscending ? 'fa-sort-up' : 'fa-sort-down';
		},
		onFilterSortAccept () {
			this.emitSearchChange();
			this.showFilterSortSheet = false;
		},
		onFilterSortCancel () {
			this.cleanInput();
			this.showFilterSortSheet = false;
		},
		setSortValue (newValue = {}) {
			const { isAscending = this.sort.isAscending, type = this.sort.type } = newValue;
			this.sort = {
				isAscending,
				type,
			};
			logger.debug({ newValue, sort: this.sort });
		},
	},
	props: {
		filterNames: {
			default: () => [],
			type: Array,
		},
		loading: {
			default: false,
			type: Boolean,
		},
		resultCount: {
			default: 0,
			type: Number,
		},
		sortNames: {
			default: () => ['ID', 'Alphabetical'],
			type: Array,
		},
		value: {
			default: () => ({}),
			type: Object,
		},
	},
	watch: {
		filterSortSheetExpansions (newValue) {
			if (newValue.length >= 1) {
				this.showFilterSortSheet = true;
			}
		},
		inputFilters () {
			this.cleanInput();
		},
		inputSort () {
			this.cleanInput();
		},
	},
};
</script>

<style lang="scss">
.search-area {
	width: 100%;

}

.sort-order-switch .v-input--selection-controls__input {
	transform: rotateZ(-90deg);
}
</style>

<template>
	<section class="search-page">
		<v-container id="search-area" :style="searchAreaStyle" class="pa-0">
			<search-area
				:disabled="resultsAreLoading"
				@change="applySearchConfig"
				:sortNames="sortNames"
				:filterNames="filterNames"
				:value="searchAreaInput"
				:resultCount="resultCount"
			>
				<template v-for="name in filterNames">
					<slot :name="`filter-${name}`" :slot="`filter-${name}`" slot-scope="{ filters }" :filters="filters">
						This is the filter area for {{ name }}
					</slot>
				</template>
			</search-area>
		</v-container>
		<div id="result-area">
			<slot name="result-area">
				<v-container class="px-0 pb-0">
					<promise-wait
						:promise="resultsPromise"
						:loadingMessage="resultLoadingMessage"
						:progress="resultLoadProgress"
					>
						<template v-slot:error="{ error }">
							<slot name="error" :error="error">
								<span>Error: {{ error.message || JSON.stringify(error) }}</span>
							</slot>
						</template>
						<template>
							<slot name="result" :data="resultsToShow">
								<ul>
									<li v-for="(v, i) in resultsToShow" :key="getDataKey(v, i)">
										all results would go here {{ v }}, {{ i }}
									</li>
								</ul>
							</slot>
						</template>
					</promise-wait>
				</v-container>
			</slot>
		</div>
		<div id="pagination-area">
			<v-expand-transition>
				<v-footer v-if="!resultsAreLoading" class="px-2">
					<v-pagination
						:value="paginationInput"
						@input="$v => pageIndex = $v - 1"
						:length="numPages"
						:total-visible="paginationMaxVisible"
						prev-icon="fa-angle-left"
						next-icon="fa-angle-right"
					/>
				</v-footer>
			</v-expand-transition>
		</div>
	</section>
</template>

<script>
import { getNumberOrDefault, getRandomToken } from '@/utilities/utils';
import PromiseWait from '@/components/utilities/PromiseWait';
import SearchArea from './SearchArea';
import getLogger from '@/utilities/Logger';

const logger = getLogger('SearchPageBase');
export default {
	activated () {
		logger.debug('activated');
		this.onFilterChange();
	},
	components: {
		PromiseWait,
		SearchArea,
	},
	computed: {
		numPages () {
			return Math.ceil(this.allResultsSorted.length / this.pageSize);
		},
		paginationContainerClasses () {
			return {
				'text-center': this.$vuetify.breakpoint.xsOnly,
				'text-right': this.$vuetify.breakpoint.smAndUp,
			};
		},
		paginationInput () {
			return this.pageIndex + 1;
		},
		paginationMaxVisible () {
			let maxAmountToShow;
			if (this.$vuetify.breakpoint.mdAndUp) {
				maxAmountToShow = 20;
			} else if (this.$vuetify.breakpoint.smOnly) {
				maxAmountToShow = 10;
			} else {
				maxAmountToShow = 4;
			}
			return maxAmountToShow;
		},
		resultCount () {
			return this.allResultsFiltered.length;
		},
		resultsToShow () {
			const { pageIndex, pageSize } = this;
			const startIndex = pageIndex * pageSize;
			return this.allResultsSorted.slice(startIndex, startIndex + pageSize);
		},
		searchAreaInput () {
			return {
				filters: this.filters,
				pageSize: this.pageSize,
				sort: this.sort,
			};
		},
		searchAreaStyle () {
			return {
				top: `${!this.removeTopOffset ? this.$vuetify.application.top : 0}px`,
			};
		},
	},
	created () {
		this.pageSize = getNumberOrDefault(this.defaultPageSize, 36);

		// default to first item in sortNames array
		this.sort = {
			isAscending: this.sort.isAscending,
			type: this.sortNames[0] || 'ID',
		};

		this.filters = this.getDefaultFilters();

		this.onFilterChange();
	},
	data () {
		return {
			allResultsFiltered: [],
			allResultsSorted: [],
			filters: {},
			pageIndex: 0,
			pageSize: 1,
			resultLoadProgress: -1,
			resultLoadingMessage: 'Loading data...',
			resultsAreLoading: false,
			resultsPromise: Promise.resolve(),
			sort: {
				isAscending: true,
				type: 'ID',
			},
			startToken: 0,
		};
	},
	methods: {
		applySearchConfig (newConfig = {}) {
			const hasNewFilters = newConfig.hasOwnProperty('filters');
			const hasNewSorts = newConfig.hasOwnProperty('sort');
			if (hasNewFilters) {
				// TODO: proper deep clone
				this.filters = { ...newConfig.filters };
				this.onFilterChange();
			}
			if (hasNewSorts) {
				this.sort.isAscending = !!newConfig.sort.isAscending;
				this.sort.type = newConfig.sort.type;
				if (!hasNewFilters) {
					this.onSortChange();
				}
			}

			if (newConfig.hasOwnProperty('pageSize')) {
				this.pageSize = newConfig.pageSize;
			}
		},
		onFilterChange () {
			logger.debug('onFilterChange', {
				filters: this.filters,
				sort: this.sort,
			});
			this.resultsAreLoading = true;
			this.resultLoadProgress = 0;
			this.resultLoadingMessage = 'Filtering data...';
			this.allResultsFiltered = [];
			const startToken = this.resetStartToken();
			this.resultsPromise = this.getFilteredData(this.filters, this.sort)
				.then(data => {
					if (this.startToken === startToken) {
						// assumption: filtering data also returns pre-sorted
						this.allResultsFiltered = data;
						this.allResultsSorted = data;
					}
				}).finally(() => {
					if (this.startToken === startToken) {
						this.resultLoadProgress = 100;
						this.resultsAreLoading = false;
					}
				});
		},
		onSortChange () {
			logger.debug('onSortChange', this.sort);
			this.resultsAreLoading = true;
			this.resultLoadProgress = 0;
			this.resultLoadingMessage = 'Sorting data...';
			this.allResultsSorted = [];
			const startToken = this.resetStartToken();
			this.resultsPromise = this.getSortedData(this.allResultsFiltered, this.sort)
				.then(data => {
					if (this.startToken === startToken) {
						this.allResultsSorted = data;
					}
				}).finally(() => {
					if (this.startToken === startToken) {
						this.resultLoadProgress = 100;
						this.resultsAreLoading = false;
					}
				});
		},
		resetStartToken () {
			const newToken = getRandomToken();
			this.startToken = newToken;
			return newToken;
		},
	},
	props: {
		defaultPageSize: {
			default: 36,
			type: Number,
		},
		filterNames: {
			default: () => [],
			type: Array,
		},
		getDataKey: {
			default: (data, index) => index,
			type: Function,
		},
		getDefaultFilters: {
			default: () => ({
				name: '',
			}),
			type: Function,
		},
		getFilteredData: {
			default: (filters, sorts) => {
				logger.debug('default getData with mock delay', { filters, sorts });
				return new Promise(resolve => {
					setTimeout(() => {
						resolve(new Array(1000).fill(0).map((_, i) => i + 1));
					}, 1500);
				});
			},
			type: Function,
		},
		getSortedData: {
			default: function (filteredResults, sorts) {
				// default to calling filter function
				return this.getFilteredData(this.filters, sorts);
			},
			type: Function,
		},
		removeTopOffset: {
			default: false,
			type: Boolean,
		},
		sortNames: {
			default: () => ['ID', 'Alphabetical'],
			type: Array,
		},
	},
	watch: {
		allResultsSorted () {
			this.pageIndex = 0;
		},
		pageSize (newValue) {
			this.pageIndex = 0;
		},
	},
};
</script>

<style lang="scss">
.search-page {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;

	padding-top: 0.5em;

	#search-area {
		position: sticky;
		top: 0;
		z-index: 1;
		flex: none;
	}

	#result-area {
		max-height: 100%;
		padding: 0.5em 0;
		flex: 1;
	}

	#pagination-area {
		position: sticky;
		bottom: 0;
		flex: none;
	}
}
</style>

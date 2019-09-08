<template>
	<v-container fill-height>
		<section class="search-page">
			<search-area
				id="search-area"
				:disabled="resultsAreLoading"
				:style="searchAreaStyle"
				@change="applySearchConfig"
				:sortNames="sortNames"
				:filterNames="filterNames"
				:value="searchAreaInput"
			>
				<template v-for="name in filterNames">
					<slot :name="`filter-${name}`" :slot="`filter-${name}`" slot-scope="{ filters }" :filters="filters">
						This is the filter area for {{ name }}
					</slot>
				</template>
			</search-area>
			<div id="result-area">
				<slot name="result-area">
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
				</slot>
			</div>
			<div id="pagination-area">
				pagination would go here
			</div>
		</section>
	</v-container>
</template>

<script>
import PromiseWait from '@/components/utilities/PromiseWait';
import SearchArea from './SearchArea';
import getLogger from '@/utilities/Logger';
import { getRandomToken } from '@/utilities/utils';

const logger = getLogger('SearchPageBase');
export default {
	components: {
		PromiseWait,
		SearchArea,
	},
	computed: {
		resultsToShow () {
			// TODO: add pagination logic
			return this.allResultsSorted;
		},
		searchAreaInput () {
			return {
				filters: this.filters,
				sort: this.sort,
			};
		},
		searchAreaStyle () {
			return {
				top: `${this.$vuetify.application.top}px`,
			};
		},
	},
	created () {
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
		},
		onFilterChange () {
			logger.debug('onFilterChange', {
				filters: this.filters,
				sort: this.sort,
			});
			this.resultsAreLoading = true;
			this.resultLoadProgress = 0;
			this.resultLoadingMessage = 'Filtering data...';
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
						resolve(new Array(100).fill(0));
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
		sortNames: {
			default: () => ['ID', 'Alphabetical'],
			type: Array,
		},
	},
};
</script>

<style lang="scss">
.search-page {
	width: 100%;
	height: 100%;
	display: grid;
	grid-template-rows: auto 1fr auto;
	grid-template-columns: 1fr;

	#search-area {
		position: sticky;
		top: 0;
	}

	#result-area {
		max-height: 100%;
	}

	#pagination-area {
		position: sticky;
		bottom: 0;
	}
}
</style>

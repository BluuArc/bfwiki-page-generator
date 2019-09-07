<template>
	<v-container>
		<v-layout>
			<search-area
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
		</v-layout>
		<v-layout>
			all results would go here
		</v-layout>
		<v-layout>
			pagination would go here
		</v-layout>
	</v-container>
</template>

<script>
import SearchArea from './SearchArea';
export default {
	components: {
		SearchArea,
	},
	computed: {
		searchAreaInput () {
			return {
				filters: this.filters,
				sort: this.sort,
			};
		},
	},
	created () {
		// default to first item in sortNames array
		this.sort = {
			isAscending: this.sort.isAscending,
			type: this.sortNames[0] || 'ID',
		};
	},
	data () {
		return {
			filters: {
				name: '',
			},
			sort: {
				isAscending: true,
				type: 'ID',
			},
		};
	},
	methods: {
		applySearchConfig (newConfig = {}) {
			if (newConfig.hasOwnProperty('filters')) {
				// TODO: proper deep clone
				this.filters = { ...newConfig.filters };
			}
			if (newConfig.hasOwnProperty('sort')) {
				this.sort.isAscending = !!newConfig.sort.isAscending;
				this.sort.type = newConfig.sort.type;
			}
		},
	},
	props: {
		filterNames: {
			default: () => [],
			type: Array,
		},
		sortNames: {
			default: () => ['ID', 'Alphabetical'],
			type: Array,
		},
	},
};
</script>

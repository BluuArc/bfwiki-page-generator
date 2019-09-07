<template>
	<v-container>
		<v-layout>
			<search-area
				:value="searchAreaInput"
				@change="applySearchConfig"
			/>
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
	data () {
		return {
			filters: {
				name: '',
			},
			sort: {
				isAscending: false,
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
};
</script>

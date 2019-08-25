<template>
	<ul class="data-download-selector-list">
		<li v-for="pair in dataNameKeyPairs" :key="pair.name">
			<v-layout row wrap align-baseline>
				<v-flex xs12 sm3>
					<v-label>
						{{ pair.name }}
					</v-label>
				</v-flex>
				<v-flex
					v-for="server in servers"
					:key="server"
					xs4 sm3
				>
					<v-checkbox
						v-model="pairsToDownload"
						:value="createPairKey(pair.key, server)"
						:label="server"
						:aria-label="`Download ${server} data for ${pair.name}`"
					/>
				</v-flex>
			</v-layout>
		</li>
	</ul>
</template>

<script>
import { DATA_MAPPING, SERVERS } from '@/utilities/constants';

export default {
	computed: {
		dataNameKeyPairs () {
			return Object.keys(DATA_MAPPING)
				.map(key => ({ key, name: DATA_MAPPING[key].name }));
		},
		servers () {
			return SERVERS.slice();
		},
	},
	data () {
		return {
			pairsToDownload: [],
		};
	},
	methods: {
		createPairKey (key, server) {
			return `${key}-${server}`;
		},
	},
};
</script>

<style lang="scss">
ul.data-download-selector-list {
	list-style: none;
}
</style>

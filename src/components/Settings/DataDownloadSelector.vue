<template>
	<ul id="data-download-selector-list">
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
					<!-- TODO: implement date display -->
					<template v-if="!blacklistedPairs.includes(createPairKey(pair.key, server))">
						<v-checkbox
							v-model="pairsToDownload"
							:value="createPairKey(pair.key, server)"
							:disabled="blacklistedPairs.includes(createPairKey(pair.key, server))"
							:label="server"
							:aria-label="`Select data for ${pair.name} of the ${server} server`"
							hint="No data found."
							persistent-hint
						/>
					</template>
					<template v-else>
						<v-checkbox
							disabled
							:label="server"
							:aria-label="`Data for ${pair.name} of the ${server} server is unavailable`"
							hint="Data unavailable."
							persistent-hint
						/>
					</template>
				</v-flex>
			</v-layout>
		</li>
		<li class="py-2">
			<v-layout row wrap align-baseline>
				<v-flex xs12 sm3>
					<v-label>
						Select All
					</v-label>
				</v-flex>
				<v-flex
					v-for="server in servers"
					:key="server"
					xs4 sm3
				>
					<v-btn
						outlined
						@click="addEntriesForServer(server)"
						:aria-label="`Select all data for ${server} server`"
					>
						{{ server }}
					</v-btn>
				</v-flex>
			</v-layout>
		</li>
		<li class="py-2 pl-0" id="clear-data-download-area">
			<v-btn
				block
				outlined
				:disabled="pairsToDownload.length === 0"
				@click="pairsToDownload = []"
			>
				Clear Selection
			</v-btn>
		</li>
	</ul>
</template>

<script>
import { DATA_MAPPING, SERVERS, SERVER_NAME_MAPPING } from '@/utilities/constants';
import { arraysAreIdentical, stringCompare } from '@/utilities/comparisons';

export default {
	computed: {
		blacklistedPairs () {
			// consist of pairs that can't be downloaded
			return [
				this.createPairKey(DATA_MAPPING.dictionary.key, SERVER_NAME_MAPPING.Europe),
				this.createPairKey(DATA_MAPPING.dictionary.key, SERVER_NAME_MAPPING.Japan),
			];
		},
		dataNameKeyPairs () {
			return Object.keys(DATA_MAPPING)
				.map(key => ({ key, name: DATA_MAPPING[key].name }))
				.sort((a, b) => stringCompare(a.name, b.name));
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
		addEntriesForServer (server) {
			const { dataNameKeyPairs, createPairKey, pairsToDownload } = this;
			dataNameKeyPairs.forEach(({ key }) => {
				const pairKey = createPairKey(key, server);
				if (!pairsToDownload.includes(pairKey)) {
					pairsToDownload.push(pairKey);
				}
			});
		},
		createPairKey (key, server) {
			return `${key}-${server}`;
		},
	},
	props: {
		value: {
			default: () => [],
			type: Array,
		},
	},
	watch: {
		pairsToDownload (newValue) {
			const { blacklistedPairs } = this;
			if (newValue.some(v => blacklistedPairs.includes(v))) {
				this.pairsToDownload = newValue.filter(v => !blacklistedPairs.includes(v));
			} else if (!arraysAreIdentical(newValue, this.value)) {
				this.$emit('input', newValue);
			}
		},
		value: {
			handler (newValue) {
				this.pairsToDownload = Array.isArray(newValue)
					? newValue.slice()
					: [];
			},
			immediate: true,
		},
	},
};
</script>

<style lang="scss">
ul#data-download-selector-list {
	list-style: none;

	#clear-data-download-area {
		margin-left: -24px;
	}
}
</style>

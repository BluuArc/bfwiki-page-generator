<template>
	<ul id="data-download-selector-list">
		<li v-for="pair in dataNameKeyPairs" :key="pair.name">
			<v-layout row wrap align-baseline class="mb-3">
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
					<scoped-variables :pairKey="createPairKey(pair.key, server)" v-slot="{ pairKey }">
						<template v-if="!blacklistedPairs.includes(pairKey)">
							<v-checkbox
								v-model="pairsToDownload"
								:value="pairKey"
								:disabled="blacklistedPairs.includes(pairKey)"
								:label="server"
								:aria-label="`Select data for ${pair.name} of the ${server} server`"
								:hint="getDataStatus(pairKey)"
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
					</scoped-variables>
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
import { createPairKey, parsePairKey } from '@/utilities/BfDatabase/utils';
import ScopedVariables from '@/components/utilities/ScopedVariables';
import bfDatabase from '@/utilities/BfDatabase/index.client';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import getLogger from '@/utilities/Logger';

const logger = getLogger('DataDownloadSelector');
export default {
	components: {
		ScopedVariables,
	},
	computed: {
		availableTablesPromise () {
			return this.$store.state.availableTablesPromise;
		},
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
	created () {
		this.updatePairStatusMapping();
	},
	data () {
		return {
			pairStatusMapping: {},
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
			return createPairKey(key, server);
		},
		getDataStatus (pairKey) {
			/**
			 * @type {Date}
			 */
			const date = this.pairStatusMapping[pairKey];
			let result;
			if (Object.keys(this.pairStatusMapping).length === 0) {
				result = 'Loading data...';
			} else if (date > -1) {
				result = `Updated ${formatDistanceToNow(date)} ago (${date.toLocaleString()})`;
			} else {
				result = 'No data cached.';
			}
			return result;
		},
		async updatePairStatusMapping () {
			this.pairStatusMapping = {};
			const { statisticsToken } = this;
			const worker = await bfDatabase;
			const dateInfo = await this.availableTablesPromise.then((pairKeys) => {
				logger.debug('getting date info for following pairKeys', pairKeys);
				const tablesSet = new Set(pairKeys.map(key => parsePairKey(key).table));
				const tables = Array.from(tablesSet).map(table => ({ table }));
				return worker.getDateInformationForTableKeyPairs(tables);
			});
			if (statisticsToken === this.statisticsToken) {
				this.pairStatusMapping = this.dataNameKeyPairs.reduce((acc, { key }) => {
					SERVERS.forEach(server => {
						const pairKey = createPairKey(key, server);
						acc[pairKey] = dateInfo[pairKey] || -1;
					});
					return acc;
				}, {});
				logger.debug({ dateInfo, pairStatusMapping: this.pairStatusMapping });
			}
		},
	},
	props: {
		statisticsToken: {
			default: 0,
			type: Number,
		},
		value: {
			default: () => [],
			type: Array,
		},
	},
	watch: {
		availableTablesPromise () {
			this.$emit('updatestatistics');
		},
		pairsToDownload (newValue) {
			const { blacklistedPairs } = this;
			if (newValue.some(v => blacklistedPairs.includes(v))) {
				this.pairsToDownload = newValue.filter(v => !blacklistedPairs.includes(v));
			} else if (!arraysAreIdentical(newValue, this.value)) {
				this.$emit('input', newValue);
			}
		},
		statisticsToken () {
			this.updatePairStatusMapping();
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

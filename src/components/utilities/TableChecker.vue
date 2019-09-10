<template>
	<promise-wait
		:promise="validationPromise"
		:postMountDelay="250"
		loadingMessage="Checking cached tables..."
	>
		<template v-slot="{ result }">
			<v-container v-if="result" >
				<v-layout>
					You are missing some data for the {{ getCurrentServer() }} server ({{ result }}). The missing data can be downloaded on the home page.
				</v-layout>
				<v-layout class="ma-2" justify-center>
					<v-btn to="/">Go to Home Page</v-btn>
				</v-layout>
			</v-container>
			<template v-else>
				<slot name="default">
					Success!
				</slot>
			</template>
		</template>
	</promise-wait>
</template>

<script>
import { createPairKey, parsePairKey } from '@/utilities/BfDatabase/utils';
import { DATA_MAPPING } from '@/utilities/constants';
import PromiseWait from '@/components/utilities/PromiseWait';
import appLocalStorageStore from '@/utilities/AppLocalStorageStore';

export default {
	components: {
		PromiseWait,
	},
	computed: {
		tablesAsPairs () {
			const currentServer = this.getCurrentServer();
			return this.expectedTables.map(table => createPairKey(table, currentServer));
		},
		validationPromise () {
			// eslint-disable-next-line vue/no-async-in-computed-properties
			return this.$store.state.availableTablesPromise
				.then(tables => {
					const missingTables = this.tablesAsPairs.filter(pair => !tables.includes(pair));
					return missingTables.map(pair => DATA_MAPPING[parsePairKey(pair).table].name)
						.sort()
						.join(', ');
				});
		},
	},
	methods: {
		getCurrentServer () {
			return appLocalStorageStore.serverName;
		},
	},
	props: {
		expectedTables: {
			default: () => [],
			type: Array,
		},
	},
};
</script>

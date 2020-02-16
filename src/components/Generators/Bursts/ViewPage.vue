<template>
	<view-page-base
		:key="entryId"
		:dataArguments="dataArguments"
		:getData="getData"
		:generateWikiTemplate="getWikiTemplate"
		:tabConfig="tabConfig"
	>
		<template v-slot:templateOptions="{ inputChanged }">
			<v-layout column class="px-3">
				<v-flex>
					<v-label>Required Bond Units</v-label>
				</v-flex>
				<v-flex>
					<unit-selector
						selectDialogTitle="Select Bond Unit 1"
						aria-label="Bond Unit 1"
						@input="$e => { bondUnit1 = $e; inputChanged(); }"
					/>
				</v-flex>
				<v-flex>
					<unit-selector
						selectDialogTitle="Select Bond Unit 2"
						aria-label="Bond Unit 2"
						@input="$e => { bondUnit2 = $e; inputChanged(); }"
					/>
				</v-flex>
			</v-layout>
		</template>
	</view-page-base>
</template>

<script>
import { DATA_MAPPING, DEFAULT_TAB_NAMES } from '@/utilities/constants';
import UnitSelector from '@/components/BF/Units/SelectorField';
import ViewPageBase from '@/components/Generators/ViewPageBase';
import appLocalStorageStore from '@/utilities/AppLocalStorageStore';
import bfDatabase from '@/utilities/BfDatabase/index.client';
import { generateDbbTemplate } from '@/utilities/wiki/bursts';
import getLogger from '@/utilities/Logger';

const logger = getLogger('BurstsView');
export default {
	beforeDestroy () {
		this.$store.commit('setTitleOverride', '');
	},
	components: {
		UnitSelector,
		ViewPageBase,
	},
	computed: {
		dataArguments () {
			return [this.entryId];
		},
		entryId () {
			return this.$route.params.id;
		},
		tabConfig () {
			return [DEFAULT_TAB_NAMES.WIKI_TEMPLATE, DEFAULT_TAB_NAMES.JSON_EXPLORER];
		},
	},
	created () {
		this.$store.commit('setTitleOverride', `Burst Generator - ${this.$route.params.id}`);
	},
	data () {
		return {
			bondUnit1: null,
			bondUnit2: null,
			burstDataPromise: () => Promise.resolve(null),
			wikiTemplate: 'Loading template...',
		};
	},
	methods: {
		getData () {
			this.burstDataPromise = bfDatabase
				.then(worker => worker.getById({
					id: this.entryId,
					server: appLocalStorageStore.serverName,
					table: DATA_MAPPING.bursts.key,
				}))
				.then(burstData => {
					logger.debug({ burstData });
					if (burstData) {
						// this.burstData = burstData;
						this.$store.commit('setTitleOverride', `Burst Generator - ${burstData.name}`);
					}
					return burstData;
				});
			return this.burstDataPromise;
		},
		getWikiTemplate (burstData) {
			return Promise.resolve()
				.then(() => {
					if (burstData) {
						logger.debug({
							bondUnit1: this.bondUnit1,
							bondUnit2: this.bondUnit2,
						});
						return generateDbbTemplate(burstData, this.bondUnit1, this.bondUnit2);
					} else {
						return `No burst found with ID ${this.entryId}`;
					}
				});
		},
	},
};
</script>

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
					<unit-selector
						selectDialogTitle="Select Bond Unit"
						label="Bond Unit"
						@input="$e => { bondUnit = $e; inputChanged(); }"
					/>
				</v-flex>
				<v-flex>
					<burst-selector
						selectDialogTitle="Select Dual Brave Burst"
						label="Dual Brave Burst"
						@input="$e => { bondBurst = $e; inputChanged(); }"
					/>
				</v-flex>
			</v-layout>
		</template>
		<span slot="sp-builder">
			<promise-wait :promise="unitDataPromise" loadingMessage="Loading unit data...">
				<template v-slot="{ result }">
					<sp-build-view
						v-if="result && result.rarity === 8"
						:unitId="entryId"
						:unitData="result"
					/>
					<span v-else>
						This unit does not have any SP Enhancements
					</span>
				</template>
			</promise-wait>
		</span>
	</view-page-base>
</template>

<script>
import { DATA_MAPPING, DEFAULT_TAB_NAMES } from '@/utilities/constants';
import BurstSelector from '@/components/BF/Bursts/SelectorField';
import PromiseWait from '@/components/utilities/PromiseWait';
import SpBuildView from './SpBuildView';
import UnitSelector from '@/components/BF/Units/SelectorField';
import ViewPageBase from '@/components/Generators/ViewPageBase';
import appLocalStorageStore from '@/utilities/AppLocalStorageStore';
import bfDatabase from '@/utilities/BfDatabase/index.client';
import { generateUnitTemplate } from '@/utilities/wiki/units';
import getLogger from '@/utilities/Logger';

const logger = getLogger('UnitsView');
export default {
	beforeDestroy () {
		this.$store.commit('setTitleOverride', '');
	},
	components: {
		BurstSelector,
		PromiseWait,
		SpBuildView,
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
			return [DEFAULT_TAB_NAMES.WIKI_TEMPLATE, DEFAULT_TAB_NAMES.JSON_EXPLORER, 'SP Builder'];
		},
	},
	created () {
		this.$store.commit('setTitleOverride', `Unit Generator - ${this.$route.params.id}`);
	},
	data () {
		return {
			bondBurst: null,
			bondUnit: null,
			unitDataPromise: () => Promise.resolve(null),
			wikiTemplate: 'Loading template...',
		};
	},
	methods: {
		getData () {
			this.unitDataPromise = bfDatabase
				.then(worker => worker.getById({
					id: this.entryId,
					server: appLocalStorageStore.serverName,
					table: DATA_MAPPING.units.key,
				}))
				.then(unitData => {
					logger.debug({ unitData });
					if (unitData) {
						this.unitData = unitData;
						this.$store.commit('setTitleOverride', `Unit Generator - ${unitData.name}`);
					}
					return unitData;
				});
			return this.unitDataPromise;
		},
		getWikiTemplate (unitData) {
			logger.debug('in getWikiTemplate');
			return Promise.resolve()
				.then(() => {
					if (unitData) {
						return generateUnitTemplate(unitData, this.bondUnit, this.bondBurst && this.bondBurst.id);
					} else {
						return `No unit found with ID ${this.entryId}`;
					}
				});
		},
	},
};
</script>

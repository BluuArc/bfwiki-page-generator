<template>
	<view-page-base
		:key="entryId"
		:dataArguments="dataArguments"
		:getData="getData"
		:generateWikiTemplate="getWikiTemplate"
		:tabConfig="tabConfig"
	>
		<template v-slot:templateOptions="{ inputChanged }">
			<v-flex class="px-3">
				<v-combobox
					v-model="elgifSeries"
					:items="DEFAULT_SERIES"
					label="Elgif Categories"
					small-chips
					multiple
					clearable
					@change="inputChanged"
				>
					<template v-slot:no-data>
						<v-list-item>
							<v-list-item-content>
								<v-list-item-title>
									No results matching query. Press <kbd>enter</kbd> to create a new one.
								</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
					</template>
				</v-combobox>
			</v-flex>
		</template>
	</view-page-base>
</template>

<script>
import { DATA_MAPPING, DEFAULT_TAB_NAMES } from '@/utilities/constants';
import ViewPageBase from '@/components/Generators/ViewPageBase';
import appLocalStorageStore from '@/utilities/AppLocalStorageStore';
import bfDatabase from '@/utilities/BfDatabase/index.client';
import { generateExtraSkillTemplate } from '@/utilities/wiki/extra-skills';
import getLogger from '@/utilities/Logger';

const logger = getLogger('ExtraSkillsView');
export default {
	beforeDestroy () {
		this.$store.commit('setTitleOverride', '');
	},
	components: {
		ViewPageBase,
	},
	computed: {
		DEFAULT_SERIES: () => [
			'AilmentSeries',
			'AoESeries',
			'AuthoritySeries',
			'BBAtkSeries',
			'BBSeries',
			'BreakAtkSeries',
			'CritSeries',
			'DropRateSeries',
			'EWDSeries',
			'GlobalExclusiveSeries',
			'HitCountSeries',
			'HPSeries',
			'IgnoreDefSeries',
			'MitigationSeries',
			'NegateSeries',
			'ODFillSeries',
			'OracleSeries',
			'PassionSeries',
			'SparkSeries',
			'TabletSeries',
			'TemporarySeries',
		],
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
		this.$store.commit('setTitleOverride', `Extra Skill Generator - ${this.$route.params.id}`);
	},
	data () {
		return {
			elgifSeries: [],
			skillDataPromise: () => Promise.resolve(null),
			wikiTemplate: 'Loading template...',
		};
	},
	methods: {
		getData () {
			this.skillDataPromise = bfDatabase
				.then(worker => worker.getById({
					id: this.entryId,
					server: appLocalStorageStore.serverName,
					table: DATA_MAPPING.extraSkills.key,
				}))
				.then(skillData => {
					logger.debug({ skillData });
					if (skillData) {
						// this.skillData = skillData;
						this.$store.commit('setTitleOverride', `Extra Skill Generator - ${skillData.name}`);
					}
					return skillData;
				});
			return this.skillDataPromise;
		},
		getWikiTemplate (skillData) {
			return Promise.resolve()
				.then(() => {
					if (skillData) {
						return generateExtraSkillTemplate(skillData, this.elgifSeries || []);
					} else {
						return `No extra skill found with ID ${this.entryId}`;
					}
				});
		},
	},
};
</script>

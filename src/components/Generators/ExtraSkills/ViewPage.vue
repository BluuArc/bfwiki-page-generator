<template>
	<view-page-base
		:key="entryId"
		:dataArguments="dataArguments"
		:getData="getData"
		:generateWikiTemplate="getWikiTemplate"
		:tabConfig="tabConfig"
	>
	</view-page-base>
</template>

<script>
import { DATA_MAPPING, DEFAULT_TAB_NAMES } from '@/utilities/constants';
import ViewPageBase from '@/components/Generators/ViewPageBase';
import appLocalStorageStore from '@/utilities/AppLocalStorageStore';
import bfDatabase from '@/utilities/BfDatabase/index.client';
// import { generateItemTemplate } from '@/utilities/wiki/items';
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
						return 'TODO: Extra Skill template';
					} else {
						return `No extra skill found with ID ${this.entryId}`;
					}
				});
		},
	},
};
</script>

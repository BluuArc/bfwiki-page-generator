<template>
	<view-page-base
		:key="entryId"
		:dataArguments="dataArguments"
		:getData="getData"
		:generateWikiTemplate="getWikiTemplate"
		:tabConfig="tabConfig"
	>
		<!-- Recipe Viewer? -->
	</view-page-base>
</template>

<script>
import { DATA_MAPPING, DEFAULT_TAB_NAMES } from '@/utilities/constants';
// import PromiseWait from '@/components/utilities/PromiseWait';
import ViewPageBase from '@/components/Generators/ViewPageBase';
import appLocalStorageStore from '@/utilities/AppLocalStorageStore';
import bfDatabase from '@/utilities/BfDatabase/index.client';
import { generateItemTemplate } from '@/utilities/wiki/items';
import getLogger from '@/utilities/Logger';

const logger = getLogger('ItemsView');
export default {
	beforeDestroy () {
		this.$store.commit('setTitleOverride', '');
	},
	components: {
		// PromiseWait,
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
		this.$store.commit('setTitleOverride', `Item Generator - ${this.$route.params.id}`);
	},
	data () {
		return {
			itemDataPromise: () => Promise.resolve(null),
			wikiTemplate: 'Loading template...',
		};
	},
	methods: {
		getData () {
			this.itemDataPromise = bfDatabase
				.then(worker => worker.getById({
					id: this.entryId,
					server: appLocalStorageStore.serverName,
					table: DATA_MAPPING.items.key,
				}))
				.then(itemData => {
					logger.debug({ itemData });
					if (itemData) {
						this.itemData = itemData;
						this.$store.commit('setTitleOverride', `Item Generator - ${itemData.name}`);
					}
					return itemData;
				});
			return this.itemDataPromise;
		},
		getWikiTemplate (itemData) {
			return Promise.resolve()
				.then(() => {
					if (itemData) {
						return generateItemTemplate(itemData);
					} else {
						return `No item found with ID ${this.entryId}`;
					}
				});
		},
	},
};
</script>

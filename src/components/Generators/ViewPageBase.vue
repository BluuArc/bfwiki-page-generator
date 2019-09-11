<template>
	<v-container class="view-page-base">
		<v-overlay :value="isLoading" absolute>
			<progress-viewer
				message="Loading data..."
				:progress="-1"
			/>
		</v-overlay>
		<v-row>
			<v-tabs
				v-model="activeTab"
				class="view-page-tabs"
				:vertical="$vuetify.breakpoint.mdAndUp"
			>
				<v-tab v-for="(tab, i) in tabConfig" :key="i">
					{{ tab }}
				</v-tab>
				<v-tabs-items touchless v-model="activeTab">
					<v-tab-item
						v-for="(name, i) in tabSlotNames"
						:key="name"
					>
						<slot :name="name">
							<template v-if="i === tabIndexWiki">
								<wiki-template-viewer
									v-if="!isLoading"
									:generateTemplate="generateWikiTemplateLocal"
								/>
							</template>
							<template v-else-if="i === tabIndexJson">
								<span>This is the JSON explorer page</span>
							</template>
							<template v-else>
								<span>This is the slot for {{ name }}</span>
							</template>
						</slot>
					</v-tab-item>
				</v-tabs-items>
			</v-tabs>
		</v-row>
	</v-container>
</template>

<script>
import { DEFAULT_TAB_NAMES } from '@/utilities/constants';
import ProgressViewer from '@/components/utilities/ProgressViewer';
import { VProgressLinear } from 'vuetify/lib';
import WikiTemplateViewer from './WikiTemplateViewer';

export default {
	components: {
		ProgressViewer,
		VProgressLinear, // eslint-disable-line vue/no-unused-components
		WikiTemplateViewer,
	},
	computed: {
		tabIndexJson () {
			return this.tabConfig.indexOf(DEFAULT_TAB_NAMES.JSON_EXPLORER);
		},
		tabIndexWiki () {
			return this.tabConfig.indexOf(DEFAULT_TAB_NAMES.WIKI_TEMPLATE);
		},
		tabSlotNames () {
			const spaceRegex = / /g;
			return this.tabConfig.map(name => name.toLowerCase().replace(spaceRegex, '-'));
		},
	},
	created () {
		this.isLoading = true;
		Promise.resolve(this.getData(...this.dataArguments))
			.then(data => {
				this.dataEntry = data;
			}).finally(() => {
				this.isLoading = false;
			});
	},
	data () {
		return {
			activeTab: 0,
			dataEntry: null,
			isLoading: true,
		};
	},
	methods: {
		generateWikiTemplateLocal () {
			return this.generateWikiTemplate(this.dataEntry);
		},
	},
	props: {
		dataArguments: {
			// usable as a way to signal reload
			default: () => [],
			type: Array,
		},
		generateWikiTemplate: {
			required: true,
			type: Function,
		},
		getData: {
			default: () => Promise.resolve(),
			type: Function,
		},
		tabConfig: {
			default: () => [DEFAULT_TAB_NAMES.WIKI_TEMPLATE, DEFAULT_TAB_NAMES.JSON_EXPLORER],
			type: Array,
		},
	},
	watch: {
		tabConfig: {
			handler (newConfig) {
				if (Array.isArray(newConfig)) {
					let newActiveTabIndex = 0;
					const wikiTabIndex = newConfig.indexOf(DEFAULT_TAB_NAMES.WIKI_TEMPLATE);
					const jsonTabIndex = newConfig.indexOf(DEFAULT_TAB_NAMES.JSON_EXPLORER);
					if (wikiTabIndex >= 0) {
						newActiveTabIndex = wikiTabIndex;
					} else if (jsonTabIndex >= 0) {
						newActiveTabIndex = jsonTabIndex;
					}
					this.activeTab = newActiveTabIndex;
				}
			},
			immediate: true,
		},
	},
};
</script>

<style lang="scss">
.view-page-base {
	.view-page-tabs .v-tab {
		margin-left: 0 !important; // remove alignment with toolbar title
	}
}
</style>

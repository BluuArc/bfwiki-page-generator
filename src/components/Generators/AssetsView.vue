<template>
	<v-container class="assets-view" fluid>
		<v-layout>
			<section class="assets-view-add-area">
				<v-layout>
					<v-text-field
						label="Name"
						:value="dirtyName || dirtyUrl"
						@input="$v => dirtyName = $v"
					/>
				</v-layout>
				<v-layout>
					<v-text-field
						label="Image URL"
						:prefix="getBaseUrl()"
						:hint="persistentUrlHint"
						persistent-hint
						v-model="dirtyUrl"
					/>
				</v-layout>
				<v-layout justify-end>
					<v-btn :disabled="!dirtyUrl">Add Asset</v-btn>
				</v-layout>
			</section>
		</v-layout>
		<v-layout>
			<section class="assets-view-display-area">
				Display Assets Here
			</section>
		</v-layout>
	</v-container>
</template>

<script>
import { DEFAULT_CONTENT_URLS } from '@/utilities/constants';
import appLocalStorageStore from '@/utilities/AppLocalStorageStore';

export default {
	computed: {
		persistentUrlHint () {
			return `e.g. ${this.urlHint}`;
		},
	},
	data () {
		return {
			dirtyName: '',
			dirtyUrl: '',
		};
	},
	methods: {
		getBaseUrl () {
			const server = appLocalStorageStore.serverName;
			const baseUrl = appLocalStorageStore.getUrlForServer(server) || DEFAULT_CONTENT_URLS[server];
			return baseUrl;
		},
	},
	props: {
		urlHint: {
			default: '/unit/img/unit_ills_thum_10011.png',
			type: String,
		},
		value: {
			default: () => [],
			type: Array,
		},
	},
};
</script>

<style lang="scss">
.assets-view {
	.assets-view-add-area {
		width: 100%;
		display: grid;
		grid-template-columns: 1fr;
	}
}
</style>

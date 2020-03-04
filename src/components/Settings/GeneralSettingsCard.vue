<template>
	<v-card class="general-settings-card">
		<v-card-title>General Settings</v-card-title>
		<v-card-text>
			<form>
				<v-container fluid class="pt-0">
					<v-row align="baseline" class="settings-row">
						<v-label>
							Light Mode
						</v-label>
						<v-switch
							class="ml-2"
							aria-label="Light Mode"
							v-model="isLightTheme"
							hide-details
						/>
					</v-row>
					<v-row align="baseline" class="settings-row">
						<v-label>
							<span class="pr-1">Default Server</span>
							<v-tooltip top>
								<template v-slot:activator="{ on }">
									<v-icon v-on="on">fa-question-circle</v-icon>
								</template>
								<span>When viewing data pages, it will default to this server.</span>
							</v-tooltip>
						</v-label>
						<v-btn-toggle
							aria-label="Default Server"
							name="active-server"
							mandatory
							class="ml-2"
							v-model="defaultServerIndex"
						>
							<v-btn
								v-for="pair in serverNameValuePairs"
								:key="pair.value"
								text
							>
								{{ pair.name }}
							</v-btn>
						</v-btn-toggle>
					</v-row>
					<v-row align="baseline" class="settings-row">
						<v-text-field
							label="Content URL"
							v-model="contentUrl"
							@change="changeContentUrl"
							:placeholder="defaultContentUrl"
							hint="Leave blank to use application default."
							persistent-hint
						/>
					</v-row>
				</v-container>
			</form>
		</v-card-text>
	</v-card>
</template>

<script>
import { DEFAULT_CONTENT_URLS, SERVERS, SERVER_NAME_MAPPING } from '@/utilities/constants';
import appLocalStorageStore from '@/utilities/AppLocalStorageStore';

function getCurrentServerUrl () {
	return appLocalStorageStore.getUrlForServer(appLocalStorageStore.serverName);
}

export default {
	beforeDestroy () {
		appLocalStorageStore.store.removeEventListener(this);
	},
	beforeMount () {
		appLocalStorageStore.store.addEventListener(this, () => {
			const isLightTheme = appLocalStorageStore.useLightTheme;
			if (!!isLightTheme !== this.isLightTheme) {
				this.isLightTheme = isLightTheme;
			}

			const storedServerIndex = appLocalStorageStore.serverIndex;
			if (storedServerIndex !== this.defaultServerIndex) {
				this.defaultServerIndex = storedServerIndex;
			}

			const storedContentUrl = getCurrentServerUrl();
			if (storedContentUrl !== this.contentUrl) {
				this.contentUrl = storedContentUrl;
			}
		});
	},
	computed: {
		defaultContentUrl () {
			return DEFAULT_CONTENT_URLS[SERVERS[this.defaultServerIndex]];
		},
		serverNameValuePairs () {
			return SERVERS.map(key => ({
				name: SERVER_NAME_MAPPING[key],
				value: key,
			}));
		},
	},
	data () {
		return {
			contentUrl: getCurrentServerUrl(),
			defaultServerIndex: appLocalStorageStore.serverIndex,
			isLightTheme: appLocalStorageStore.useLightTheme,
		};
	},
	methods: {
		changeContentUrl () {
			const { contentUrl } = this;
			const storedContentUrl = getCurrentServerUrl();
			if (contentUrl !== storedContentUrl) {
				appLocalStorageStore.setUrlForServer(appLocalStorageStore.serverName, contentUrl);
			}
		},
	},
	watch: {
		defaultServerIndex (newValue) {
			const serverName = SERVERS[newValue];
			const storedIndex = appLocalStorageStore.serverIndex;
			if (!serverName) {
				this.defaultServerIndex = 0; // default to 0
			} else if (storedIndex !== newValue) {
				appLocalStorageStore.serverName = serverName;
				this.contentUrl = appLocalStorageStore.getUrlForServer(serverName);
			}
		},
		isLightTheme (newValue) {
			const storedValue = appLocalStorageStore.useLightTheme;
			if (storedValue !== !!newValue) {
				appLocalStorageStore.useLightTheme = !!newValue;
			}
		},
	},
};
</script>

<style lang="scss">
.general-settings-card {
	.settings-row {
		padding: 0.5em;
	}
}
</style>

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
							class="pl-2"
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
							class="pl-2"
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
				</v-container>
			</form>
		</v-card-text>
	</v-card>
</template>

<script>
import { SERVERS, SERVER_NAME_MAPPING, SETTING_KEYS } from '@/utilities/constants';
import store, { getStoredServerIndex, getStoredThemeValue } from '@/utilities/LocalStorageStoreInstance';

export default {
	beforeDestroy () {
		store.removeEventListener(this);
	},
	beforeMount () {
		store.addEventListener(this, () => {
			const isLightTheme = getStoredThemeValue();
			if (!!isLightTheme !== this.isLightTheme) {
				this.isLightTheme = isLightTheme;
			}

			const storedServerIndex = getStoredServerIndex();
			if (storedServerIndex !== this.defaultServerIndex) {
				this.defaultServerIndex = storedServerIndex;
			}
		});
	},
	computed: {
		serverNameValuePairs () {
			return SERVERS.map(key => ({
				name: SERVER_NAME_MAPPING[key],
				value: key,
			}));
		},
	},
	data () {
		return {
			defaultServerIndex: getStoredServerIndex(),
			isLightTheme: getStoredThemeValue(),
		};
	},
	watch: {
		defaultServerIndex (newValue) {
			const serverName = SERVERS[newValue];
			const storedIndex = getStoredServerIndex();
			if (!serverName) {
				this.defaultServerIndex = 0; // default to 0
			} else if (storedIndex !== newValue) {
				store.storeValue(SETTING_KEYS.DEFAULT_SERVER, serverName);
			}
		},
		isLightTheme (newValue) {
			const storedValue = getStoredThemeValue();
			if (storedValue !== !!newValue) {
				store.storeValue(SETTING_KEYS.USE_LIGHT_THEME, !!newValue);
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

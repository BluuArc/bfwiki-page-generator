<template>
	<v-app>
		<top-app-bar/>
		<v-content>
			<router-view/>
		</v-content>
	</v-app>
</template>

<script>
import { SETTING_KEYS } from '@/utilities/constants';
import TopAppBar from '@/components/MainShell/TopAppBar';
import getLogger, { isDebugMode } from '@/utilities/Logger'; // eslint-disable-line sort-imports
import bfDatabase from '@/utilities/BfDatabase/index.client';
import downloader from '@/utilities/BfDatabase/downloader/index.client';
import localStorageStore from '@/utilities/LocalStorageStore';

export default {
	components: {
		TopAppBar,
	},
	async created () {
		localStorageStore.addEventListener(this, () => {
			const storedThemeValue = localStorageStore.getBoolean(SETTING_KEYS.USE_LIGHT_THEME);
			if (!storedThemeValue !== this.$vuetify.theme.dark) {
				this.$vuetify.theme.dark = !storedThemeValue;
			}
		});

		const logger = getLogger('APP');
		if (isDebugMode()) {
			logger.debug('Debug Mode enabled. Adding debug object to window._bfDebug');
			window._bfDebug = {
				downloader: await downloader,
				localStorageStore,
				logger: getLogger('DevTools'),
				worker: await bfDatabase,
			};
		}
	},
	data: () => ({
		//
	}),
	name: 'App',
};
</script>

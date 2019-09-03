<template>
	<v-app>
		<top-app-bar @toggledrawer="showDrawer = !showDrawer"/>
		<left-nav-drawer v-model="showDrawer"/>
		<v-content>
			<router-view/>
		</v-content>
	</v-app>
</template>

<script>
import LeftNavDrawer from '@/components/MainShell/LeftNavDrawer';
import { SETTING_KEYS } from '@/utilities/constants';
import TopAppBar from '@/components/MainShell/TopAppBar';
import getLogger, { isDebugMode } from '@/utilities/Logger'; // eslint-disable-line sort-imports
import bfDatabase from '@/utilities/BfDatabase/index.client';
import localStorageStore from '@/utilities/LocalStorageStore';

export default {
	beforeMount () {
		const htmlElement = document.querySelector('html');
		htmlElement.classList.add('page-html');
	},
	components: {
		LeftNavDrawer,
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
				context: this,
				dbWorker: await bfDatabase,
				localStorageStore,
				logger: getLogger('DevTools'),
			};
		}
	},
	data: () => ({
		showDrawer: false,
	}),
	name: 'App',
};
</script>

<style lang="scss">
html.page-html {
	overflow-y: auto;

	&.overflow-y-hidden {
		overflow-y: hidden;
	}
}
</style>

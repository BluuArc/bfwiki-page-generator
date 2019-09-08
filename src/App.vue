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
import TopAppBar from '@/components/MainShell/TopAppBar';
import bfDatabase from '@/utilities/BfDatabase/index.client';
import getLogger from '@/utilities/Logger';
import localStorageStore, { getStoredThemeValue, isDebugMode } from '@/utilities/LocalStorageStoreInstance'; // eslint-disable-line sort-imports

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
			const storedThemeValue = getStoredThemeValue();
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

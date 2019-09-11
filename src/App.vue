<template>
	<v-app>
		<top-app-bar @toggledrawer="showDrawer = !showDrawer"/>
		<left-nav-drawer v-model="showDrawer"/>
		<v-content>
			<router-view/>
		</v-content>
		<site-trackers/>
	</v-app>
</template>

<script>
import LeftNavDrawer from '@/components/MainShell/LeftNavDrawer';
import SiteTrackers from '@/components/MainShell/SiteTrackers';
import TopAppBar from '@/components/MainShell/TopAppBar';
import appLocalStorageStore from '@/utilities/AppLocalStorageStore';
import bfDatabase from '@/utilities/BfDatabase/index.client';
import getLogger from '@/utilities/Logger';

export default {
	beforeMount () {
		const htmlElement = document.querySelector('html');
		htmlElement.classList.add('page-html');
	},
	components: {
		LeftNavDrawer,
		SiteTrackers,
		TopAppBar,
	},
	async created () {
		appLocalStorageStore.store.addEventListener(this, () => {
			const storedThemeValue = appLocalStorageStore.useLightTheme;
			if (!storedThemeValue !== this.$vuetify.theme.dark) {
				this.$vuetify.theme.dark = !storedThemeValue;
			}
		});

		const logger = getLogger('APP');
		if (appLocalStorageStore.isDebugMode) {
			logger.debug('Debug Mode enabled. Adding debug object to window._bfDebug');
			window._bfDebug = {
				appLocalStorageStore,
				context: this,
				dbWorker: await bfDatabase,
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

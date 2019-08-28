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
import getLogger from '@/utilities/Logger';
import localStorageStore from '@/utilities/LocalStorageStore';

export default {
	components: {
		TopAppBar,
	},
	created () {
		localStorageStore.addEventListener(this, () => {
			const storedThemeValue = localStorageStore.getBoolean(SETTING_KEYS.USE_LIGHT_THEME);
			if (!storedThemeValue !== this.$vuetify.theme.dark) {
				this.$vuetify.theme.dark = !storedThemeValue;
			}
		});
	},
	data: () => ({
		//
	}),
	mounted () {
		const logger = getLogger('APP');
		logger.debug('Mounted');
	},
	name: 'App',
};
</script>

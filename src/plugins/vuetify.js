import LocalStorageStore from '@/utilities/LocalStorageStore';
import { SETTING_KEYS } from '@/utilities/constants';
import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
	icons: {
		iconfont: 'fa',
	},
	theme: {
		dark: !LocalStorageStore.getBoolean(SETTING_KEYS.USE_LIGHT_THEME),
		themes: {
			light: {
				/* eslint-disable sort-keys */
				primary: '#ee44aa',
				secondary: '#424242',
				accent: '#82B1FF',
				error: '#FF5252',
				info: '#2196F3',
				success: '#4CAF50',
				warning: '#FFC107',
				/* eslint-enable sort-keys */
			},
		},
	},
});

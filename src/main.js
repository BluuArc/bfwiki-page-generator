import App from './App.vue';
import Vue from 'vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css'; // eslint-disable-line sort-imports
import '@fortawesome/fontawesome-free/css/all.css';

Vue.config.productionTip = false;

new Vue({
	render: h => h(App),
	router,
	store,
	vuetify,
}).$mount('#app');

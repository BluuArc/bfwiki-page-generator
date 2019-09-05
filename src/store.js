import { DATA_MAPPING, SERVERS } from '@/utilities/constants';
import Vue from 'vue';
import Vuex from 'vuex';
import bfDatabase from '@/utilities/BfDatabase/index.client';

Vue.use(Vuex);

export default new Vuex.Store({
	actions: {
		async updateAvailableTables (context) {
			const allEntries = Object.values(DATA_MAPPING).reduce((acc, val) => {
				acc.push({
					keys: SERVERS,
					table: val.key,
				});
				return acc;
			}, []);
			const availableTablesPromise = bfDatabase.then((worker) => {
				return worker.getCachedServersInTables(allEntries);
			});
			context.commit('setAvailableTablesPromise', availableTablesPromise);
			return availableTablesPromise;
		},
	},
	mutations: {
		setAvailableTablesPromise (state, promise) {
			state.availableTablesPromise = promise;
		},
	},
	state: {
		availableTablesPromise: Promise.resolve([]),
	},
});

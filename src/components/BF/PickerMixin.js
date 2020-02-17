import appLocalStorageStore from '@/utilities/AppLocalStorageStore';
import bfDatabase from '@/utilities/BfDatabase/index.client';
import getLogger from '@/utilities/Logger';

export default {
	data () {
		return {
			filteredDb: {},
		};
	},
	methods: {
		emitSelection (id, entry) {
			this.$emit('select', { entry, id });
		},
		getFilteredDataForOptions ({
			extractedFields,
			filters,
			logger = getLogger('PickerMixin'),
			server = appLocalStorageStore.serverName,
			sortOptions,
			table,
		}) {
			return bfDatabase.then(worker => {
				return worker.getFilteredDb({
					extractedFields,
					filters,
					keysAndDb: true,
					server,
					sortOptions,
					table,
				}).then(({ db, keys }) => {
					this.filteredDb = db;
					logger.debug('filter result keys', { filters, keys, sortOptions });
					return keys;
				});
			});
		},
		getSortedDataForOptions ({
			filteredKeys,
			logger = getLogger('PickerMixin'),
			server = appLocalStorageStore.serverName,
			sortOptions,
			table,
		}) {
			return bfDatabase.then(worker => {
				return worker.getSortedKeys({
					keys: filteredKeys,
					server,
					sortOptions,
					table,
				});
			}).then(keys => {
				logger.debug('sort result keys', { keys, sortOptions });
				return keys;
			});
		},
	},
	props: {
		getEntryLink: {
			default: () => undefined,
			type: Function,
		},
		removeTopOffset: {
			default: false,
			type: Boolean,
		},
		useLinkRedirect: {
			default: false,
			type: Boolean,
		},
	},
};

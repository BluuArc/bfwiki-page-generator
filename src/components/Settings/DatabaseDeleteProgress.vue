<template>
	<progress-viewer
		message="Deleting data..."
		:progress="-1"
	/>
</template>

<script>
import ProgressViewer from '@/components/utilities/ProgressViewer';
import { VProgressLinear } from 'vuetify/lib';
import bfDatabase from '@/utilities/BfDatabase/index.client';
import getLogger from '@/utilities/Logger';

const logger = getLogger('DeleteProgress');
export default {
	components: {
		ProgressViewer,

		// needed to use ProgressViewer
		VProgressLinear, // eslint-disable-line vue/no-unused-components
	},
	methods: {
		async delete () {
			const { pairsToDelete } = this;
			if (pairsToDelete.length > 0) {
				const db = await bfDatabase;
				this.$emit('start');
				try {
					await db.deleteMultiple(pairsToDelete);
					this.currentProgress = 100;
					logger.debug('successfully deleted', pairsToDelete);
				} finally {
					this.$emit('finish');
				}
			}
		},
	},
	props: {
		pairsToDelete: {
			required: true,
			type: Array,
		},
	},
	watch: {
		pairsToDelete: {
			handler (newValue) {
				if (newValue.length > 0) {
					this.delete();
				}
			},
			immediate: true,
		},
	},
};
</script>

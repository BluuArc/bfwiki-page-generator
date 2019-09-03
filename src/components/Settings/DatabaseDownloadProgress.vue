<template>
	<progress-viewer
		:message="progressMessage"
		:bufferProgress="currentProgress"
		:progress="currentProgress"
	/>
</template>

<script>
import ProgressViewer from '@/components/utilities/ProgressViewer';
import { Thread } from 'threads';
import { VProgressLinear } from 'vuetify/lib';
import downloaderFactory from '@/utilities/BfDatabase/downloader/index.client';
import getLogger from '@/utilities/Logger';

const logger = getLogger('DownloadProgress');
export default {
	components: {
		ProgressViewer,

		// needed to use ProgressViewer
		VProgressLinear, // eslint-disable-line vue/no-unused-components
	},
	data () {
		return {
			currentProgress: 0,
			progressMessage: 'Downloading data...',
		};
	},
	methods: {
		async download () {
			const { pairsToDownload } = this;
			if (pairsToDownload.length > 0) {
				const downloader = await downloaderFactory();
				this.currentProgress = 0;
				this.progressMessage = 'Downloading data...';
				this.$emit('start');
				try {
					const observablePromise = downloader(pairsToDownload);
					await new Promise((resolve, reject) => {
						observablePromise.subscribe(
							progress => {
								logger.debug(progress.loaded, progress.total);
								this.progressMessage = progress.message;
								this.currentProgress = (progress.loaded / progress.total) * 100;
							},
							error => {
								this.progressMessage = `An error has occurred. [${error.toString ? error.toString() : error}]`;
								reject(error);
							},
							() => resolve(),
						);
					});
				} finally {
					logger.debug('waiting for thread to terminate');
					await Thread.terminate(downloader);
					this.$emit('finish');
				}
			}
		},
	},
	props: {
		pairsToDownload: {
			required: true,
			type: Array,
		},
	},
	watch: {
		pairsToDownload: {
			handler (newValue) {
				if (newValue.length > 0) {
					this.download();
				}
			},
			immediate: true,
		},
	},
};
</script>

<template>
	<v-dialog
		persistent
		width="500"
		v-model="showDialog"
	>
		<v-card>
			<v-card-text>
				<p v-text="progressMessage"></p>
				<v-progress-linear
					:buffer-value="currentProgress"
					:value="currentProgress"
					stream
				/>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script>
import { Thread } from 'threads';
import downloaderFactory from '@/utilities/BfDatabase/downloader/index.client';
import getLogger from '@/utilities/Logger';

const logger = getLogger('DownloadDialog');
export default {
	data () {
		return {
			currentProgress: 0,
			progressMessage: 'Downloading data...',
			showDialog: false,
		};
	},
	methods: {
		async download () {
			const { pairsToDownload } = this;
			if (pairsToDownload.length > 0) {
				const downloader = await downloaderFactory();
				this.currentProgress = 0;
				this.progressMessage = 'Downloading data...';
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
					this.showDialog = false;
				}
			}
		},
	},
	props: {
		pairsToDownload: {
			required: true,
			type: Array,
		},
		value: {
			default: false,
			type: Boolean,
		},
	},
	watch: {
		pairsToDownload (newValue) {
			if (newValue.length > 0) {
				this.download();
			}
		},
		showDialog (newValue) {
			if (newValue !== this.value) {
				this.$emit('input', newValue);
			}
		},
		value: {
			handler (newValue) {
				const actualValue = !!newValue;
				if (actualValue !== this.showDialog) {
					this.showDialog = actualValue;
				}
			},
			immediate: true,
		},
	},
};
</script>

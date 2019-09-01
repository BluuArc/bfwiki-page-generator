<template>
	<v-card width="100%">
		<v-card-title>Download Data</v-card-title>
		<v-card-text>
			<data-download-selector
				v-model="dataPairsToDownload"
				:statisticsToken="statisticsToken"
			/>
		</v-card-text>
		<v-card-actions>
			<v-btn
				:disabled="!hasPairs"
				color="primary"
				@click="startDownload"
			>
				Download
			</v-btn>
			<v-spacer/>
			<v-btn
				:disabled="!hasPairs"
				outlined color="error"
			>
				Delete
			</v-btn>
		</v-card-actions>
		<download-dialog
			v-model="showDownloadDialog"
			:pairsToDownload="pairsForDownloadDialog"
		/>
	</v-card>
</template>

<script>
import DataDownloadSelector from './DataDownloadSelector';
import DownloadDialog from './DownloadDialog';

export default {
	components: {
		DataDownloadSelector,
		DownloadDialog,
	},
	computed: {
		hasPairs () {
			return this.dataPairsToDownload.length > 0;
		},
	},
	data () {
		return {
			dataPairsToDownload: [],
			pairsForDownloadDialog: [],
			showDownloadDialog: false,
			statisticsToken: 0,
		};
	},
	methods: {
		startDownload () {
			this.showDownloadDialog = true;
			this.pairsForDownloadDialog = this.dataPairsToDownload.map(pairKey => {
				const [table, server] = pairKey.split('-');
				return { key: table, server };
			});
		},
	},
	watch: {
		showDownloadDialog (isShowing) {
			if (!isShowing) { // finished download, so refresh statistics
				this.statisticsToken = Date.now();
				this.dataPairsToDownload = [];
			}
		},
	},
};
</script>

<template>
	<v-card width="100%">
		<v-card-title>Download Data</v-card-title>
		<v-card-text>
			<data-download-selector v-model="dataPairsToDownload"/>
		</v-card-text>
		<v-card-actions>
			<v-btn :disabled="!hasPairs" color="primary">Download</v-btn>
			<v-spacer/>
			<v-btn :disabled="!hasPairs" outlined color="error">Delete</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import DataDownloadSelector from './DataDownloadSelector';

export default {
	components: {
		DataDownloadSelector,
	},
	computed: {
		hasPairs () {
			return this.dataPairsToDownload.length > 0;
		},
	},
	data () {
		return {
			dataPairsToDownload: [],
		};
	},
};
</script>

<template>
	<v-card width="100%">
		<v-card-title>Download Data</v-card-title>
		<v-card-text>
			<data-download-selector v-model="dataPairsToDownload"/>
		</v-card-text>
		<v-card-actions>
			<v-btn color="primary">Download</v-btn>
			<v-spacer/>
			<v-btn outlined color="error">Delete</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import DataDownloadSelector from './DataDownloadSelector';

export default {
	components: {
		DataDownloadSelector,
	},
	data () {
		return {
			dataPairsToDownload: [],
		};
	},
};
</script>

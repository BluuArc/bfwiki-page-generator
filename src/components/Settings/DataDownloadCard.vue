<template>
	<v-card width="100%">
		<v-card-title>Download Data</v-card-title>
		<v-card-text>
			<data-download-selector
				v-model="dataPairsToConsider"
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
		<multi-dialog
			v-model="activeDialog"
			persistent
			width="500"
			:slotsToExpose="dialogNamesArray"
		>
			<v-card :slot="DIALOG_NAMES.DOWNLOAD">
				<v-card-text>
					<database-download-progress
						@finish="() => activeDialog = ''"
						:pairsToDownload="pairsForDownloadDialog"
					/>
				</v-card-text>
			</v-card>
		</multi-dialog>
	</v-card>
</template>

<script>
import DataDownloadSelector from './DataDownloadSelector';
import DatabaseDownloadProgress from './DatabaseDownloadProgress';
import MultiDialog from '@/components/utilities/MultiDialog';

export default {
	components: {
		DataDownloadSelector,
		DatabaseDownloadProgress,
		MultiDialog,
	},
	computed: {
		DIALOG_NAMES: () => Object.freeze({
			DELETE: 'delete',
			DOWNLOAD: 'download',
		}),
		dialogNamesArray () {
			return Object.values(this.DIALOG_NAMES);
		},
		hasPairs () {
			return this.dataPairsToConsider.length > 0;
		},
	},
	data () {
		return {
			activeDialog: '',
			dataPairsToConsider: [],
			pairsForDownloadDialog: [],
			statisticsToken: 0,
		};
	},
	methods: {
		startDownload () {
			this.activeDialog = this.DIALOG_NAMES.DOWNLOAD;
			this.pairsForDownloadDialog = this.dataPairsToConsider.map(pairKey => {
				const [table, server] = pairKey.split('-');
				return { key: table, server };
			});
		},
	},
	watch: {
		activeDialog (newValue, oldValue) {
			if (oldValue === this.DIALOG_NAMES.DOWNLOAD) { // finished download, so refresh statistics
				this.statisticsToken = Date.now();
				this.dataPairsToConsider = [];
			}
		},
	},
};
</script>

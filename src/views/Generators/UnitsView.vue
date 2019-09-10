<template>
	<div>
		<div>I am the view for {{ $route.params.id }}</div>
		<p>
			<pre><code v-text="wikiTemplate"/></pre>
		</p>
	</div>
</template>

<script>
import { DATA_MAPPING } from '@/utilities/constants';
import appLocalStorageStore from '@/utilities/AppLocalStorageStore';
import bfDatabase from '@/utilities/BfDatabase/index.client';
import { generateUnitTemplate } from '@/utilities/wiki/units';
import getLogger from '../../utilities/Logger';

const logger = getLogger('UnitsView');
export default {
	computed: {
		entryId () {
			return this.$route.params.id;
		},
	},
	data () {
		return {
			wikiTemplate: 'Loading template...',
		};
	},
	methods: {
		getWikiTemplate () {
			return bfDatabase
				.then(worker => worker.getById({
					id: this.entryId,
					server: appLocalStorageStore.serverName,
					table: DATA_MAPPING.units.key,
				}))
				.then(unitData => {
					logger.debug(unitData);
					return generateUnitTemplate(unitData);
				}).then(templateData => {
					this.wikiTemplate = templateData;
				}).catch(err => {
					this.wikiTemplate = err;
				});
		},
	},
	watch: {
		entryId: {
			handler (newValue) {
				if (newValue) {
					this.getWikiTemplate();
				}
			},
			immediate: true,
		},
	},
};
</script>

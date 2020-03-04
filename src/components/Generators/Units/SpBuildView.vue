<template>
	<promise-wait :promise="allEnhancementsPromise" loadingMessage="Getting SP Enhancements...">
		<template v-slot="{ result }">
			<section class="sp-build-area">
				<div>
					<sp-builder
						v-model="currentSpCode"
						:spEntries="result"
					/>
				</div>
				<v-layout justify-space-between class="pa-2">
					<copy-button
						:disabled="!currentSpCode"
						buttonText="Copy"
						buttonTextCopied="Build Copied!"
						:key="spTemplate"
						:value="spTemplate"
					>
						Copy
					</copy-button>
					<v-btn text @click="currentSpCode = ''">Clear</v-btn>
				</v-layout>
			</section>
		</template>
	</promise-wait>
</template>

<script>
import CopyButton from '@/components/utilities/CopyButton';
import { DATA_MAPPING } from '@/utilities/constants';
import PromiseWait from '@/components/utilities/PromiseWait';
import SpBuilder from '@/components/BF/Units/SpBuilder';
import appLocalStorageStore from '@/utilities/AppLocalStorageStore';
import bfDatabase from '@/utilities/BfDatabase/index.client';
import { generateSpTemplate } from '@/utilities/wiki/units';
import getLogger from '@/utilities/Logger';

const logger = getLogger('UnitsView');
export default {
	components: {
		CopyButton,
		PromiseWait,
		SpBuilder,
	},
	computed: {
		spTemplate () {
			return generateSpTemplate(this.currentSpCode, this.spEntries, this.unitData);
		},
	},
	data () {
		return {
			allEnhancementsPromise: Promise.resolve([]),
			currentSpCode: '',
			spEntries: [],
		};
	},
	methods: {
		getSpEnhancements (entryId) {
			return bfDatabase.then(worker => worker.getById({
				id: entryId,
				server: appLocalStorageStore.serverName,
				table: DATA_MAPPING.spEnhancements.key,
			})).then((result = {}) => {
				const spEntries = Array.isArray(result.skills) ? result.skills : [];
				this.spEntries = spEntries;
				logger.debug({ spEntries });
				return spEntries;
			});
		},
	},
	props: {
		unitData: {
			default: () => ({}),
			type: Object,
		},
		unitId: {
			required: true,
		},
	},
	watch: {
		unitId: {
			handler (newId) {
				if (newId) {
					this.allEnhancementsPromise = this.getSpEnhancements(newId);
				}
			},
			immediate: true,
		},
	},
};
</script>

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
				<div>
					accept buttons here
				</div>
			</section>
		</template>
	</promise-wait>
</template>

<script>
import { DATA_MAPPING } from '@/utilities/constants';
import PromiseWait from '@/components/utilities/PromiseWait';
import SpBuilder from '@/components/BF/Units/SpBuilder';
import appLocalStorageStore from '@/utilities/AppLocalStorageStore';
import bfDatabase from '@/utilities/BfDatabase/index.client';

export default {
	components: {
		PromiseWait,
		SpBuilder,
	},
	data () {
		return {
			allEnhancementsPromise: Promise.resolve([]),
			currentSpCode: '',
		};
	},
	methods: {
		getSpEnhancements (entryId) {
			return bfDatabase.then(worker => worker.getById({
				id: entryId,
				server: appLocalStorageStore.serverName,
				table: DATA_MAPPING.spEnhancements.key,
			})).then((result = {}) => Array.isArray(result.skills) ? result.skills : []);
		},
	},
	props: {
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

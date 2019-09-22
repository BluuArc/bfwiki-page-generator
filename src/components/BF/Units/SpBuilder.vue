<template>
	<ul class="sp-builder">
		<li class="sp-builder--header sp-builder--entry">
			<v-checkbox
				class="sp-builder--checkbox pl-2"
				:label="`${runningSum} SP`"
				:input-value="overallState === OVERALL_STATE_VALUES.ALL"
				:indeterminate="overallState === OVERALL_STATE_VALUES.SOME"
				@click.native="toggleOverallState"
				hide-details
			/>
			<span class="sp-builder--category-icon text-center">
				<v-label>Type</v-label>
			</span>
			<span class="sp-builder--description">
				<v-label>Description</v-label>
			</span>
		</li>
		<li
			v-for="(entry, i) in spEntries"
			:key="entry.id"
			class="sp-builder--entry"
		>
			<v-divider class="sp-builder--divider py-2"/>
			<v-checkbox
				class="sp-builder--checkbox pl-2"
				:input-value="selectedCodes.includes(allEntriesCode[i])"
				@click.native="toggleSpEntry(entry, i)"
				hide-details
				:label="`${entry.skill.bp} SP`"
			/>
			<span class="sp-builder--category-icon">
				<sp-icon
					:category="+entry.category"
					:displaySize="24"
				/>
			</span>
			<span class="sp-builder--description">
				<scoped-variables
					:description="getSpDescription(entry, i)"
					:dependencyText="getSpDependencyText(entry)"
				>
					<template v-slot="{ dependencyText, description }">
						<span v-html="description"/>
						<i v-if="dependencyText" v-text="dependencyText"/>
					</template>
				</scoped-variables>
			</span>
			<v-btn icon class="sp-builder--expansion-icon" @click="toggleJsonIndex(i)" :data-expand="visibleJsonIndices[i]">
				<v-icon>fas fa-chevron-down</v-icon>
			</v-btn>
			<v-expand-transition>
				<json-explorer-view
					v-show="visibleJsonIndices[i]"
					class="sp-builder--json"
					:json="entry"
					rootName="SP Entry"
				/>
			</v-expand-transition>
		</li>
	</ul>
</template>

<script>
import {
	getAllDependenciesFromSpEntry,
	getAllEntriesThatDependOnSpEntry,
	getSpCost,
	getSpDependencyText,
	getSpDescription,
	spCodeToIndex,
	spIndexToCode,
} from '@/utilities/bf-core/spEnhancements';
import JsonExplorerView from '@/components/Generators/JsonExplorerView';
import ScopedVariables from '@/components/utilities/ScopedVariables';
import SpIcon from '@/components/BF/Units/SpIcon';
import { debounce } from '@/utilities/utils';

const OVERALL_STATE_VALUES = Object.freeze({
	ALL: 'all',
	NONE: 'none',
	SOME: 'some',
});
export default {
	components: {
		JsonExplorerView,
		ScopedVariables,
		SpIcon,
	},
	computed: {
		OVERALL_STATE_VALUES: () => OVERALL_STATE_VALUES,
		allEntriesCode () {
			return this.spEntries.map((_, i) => spIndexToCode(i)).join('');
		},
		overallState () {
			const { runningSum, overallSum } = this;
			if (runningSum === overallSum) {
				return OVERALL_STATE_VALUES.ALL;
			} else if (runningSum === 0) {
				return OVERALL_STATE_VALUES.NONE;
			} else {
				return OVERALL_STATE_VALUES.SOME;
			}
		},
		overallSum () {
			return getSpCost(this.spEntries, this.allEntriesCode);
		},
		runningCode () {
			return this.selectedCodes
				.slice().sort()
				.join('');
		},
		runningSum () {
			return getSpCost(this.spEntries, this.runningCode);
		},
		selectedEntries () {
			const { spEntries } = this;
			return this.selectedCodes
				.map(code => spEntries[spCodeToIndex(code)])
				.filter(v => v);
		},
	},
	data () {
		return {
			selectedCodes: [],
			visibleJsonIndices: {},
		};
	},
	methods: {
		getSpDependencyText (entry) {
			return entry.dependency ? getSpDependencyText(entry, this.spEntries) : '';
		},
		getSpDescription (entry, index) {
			return `<b>${spIndexToCode(index)}</b>: ${getSpDescription(entry)}`;
		},
		toggleJsonIndex (index) {
			this.$set(this.visibleJsonIndices, index, !this.visibleJsonIndices[index]);
		},
		toggleOverallState () {
			if (this.overallState === OVERALL_STATE_VALUES.ALL) {
				this.selectedCodes = [];
			} else {
				this.selectedCodes = this.allEntriesCode.split('');
			}
		},
		toggleSpEntry (entry, index) {
			const code = spIndexToCode(index);
			const isCurrentlyActive = this.selectedCodes.includes(code);
			let newEntries = this.selectedCodes.slice();
			if (isCurrentlyActive) {
				// turn off entry and entries dependent on it
				const dependentEntries = getAllEntriesThatDependOnSpEntry(entry, this.spEntries);
				newEntries = newEntries.filter(activeCode => activeCode !== code && !dependentEntries.includes(activeCode));
			} else {
				// toggle on entry and entries it depends on
				newEntries.push(code);

				const dependencies = getAllDependenciesFromSpEntry(entry, this.spEntries);
				dependencies.forEach(dependencyCode => {
					if (!newEntries.includes(dependencyCode)) {
						newEntries.push(dependencyCode);
					}
				});
			}

			this.selectedCodes = newEntries;
		},
	},
	props: {
		spEntries: {
			required: true,
			type: Array,
		},
		value: {
			default: '',
			type: String,
		},
	},
	watch: {
		runningCode: debounce(function (newValue) {
			this.$emit('input', newValue);
		}),
		spEntries () {
			this.visibleJsonIndices = {};
		},
		value: {
			handler (newValue) {
				if (newValue !== this.runningCode) {
					this.selectedCodes = (newValue || '').split('');
				}
			},
			immediate: true,
		},
	},
};
</script>

<style lang="scss">
@import "@/styles/util-mixins.scss";

ul.sp-builder {
	@include list-style-reset();

	.sp-builder--entry {
		margin: 0.5em 0;
		display: grid;
		grid-template-columns: 100px 40px 1fr 44px;
		grid-template-rows: auto auto auto auto;
		grid-template-areas:	"div div div div"
													"checkbox category-icon desc expand"
													"json json json json";
		align-items: center;
		grid-column-gap: 1em;

		&.sp-builder--header {
			// header does not have a divideer
			grid-template-rows: auto auto auto;
			grid-template-areas:	"checkbox category-icon desc expand"
														"json json json json";
		}

		.sp-builder--divider {
			grid-area: div;
		}

		.sp-builder--expansion-icon {
			grid-area: expand;

			&[data-expand=true] {
				transform: rotate(180deg);
			}
		}

		.sp-builder--checkbox {
			grid-area: checkbox;
			margin-top: 0;
		}

		.sp-builder--category-icon {
			grid-area: category-icon;
			height: 24px;
			justify-self: center;
		}

		.sp-builder--description {
			grid-area: desc;
			display: flex;
			flex-direction: column;
		}

		.sp-builder--json {
			grid-area: json;
		}
	}
}
</style>

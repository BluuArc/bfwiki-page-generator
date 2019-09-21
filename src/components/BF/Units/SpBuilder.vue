<template>
	<ul class="sp-builder">
		<li class="sp-builder--header sp-builder--entry">
			<v-checkbox
				class="sp-builder--checkbox pl-2"
				v-model="selectedEntries"
				:value="-1"
				multiple
				hide-details
				label="MMM SP"
			/>
			<v-label class="sp-builder--category-icon text-center">
				Type
			</v-label>
			<v-label class="sp-builder--description">
				Description
			</v-label>
		</li>
		<li v-for="(entry, i) in spEntries" :key="entry.id" class="sp-builder--entry">
			<v-divider class="sp-builder--divider"/>
			<v-checkbox
				class="sp-builder--checkbox pl-2"
				v-model="selectedEntries"
				:value="i"
				multiple
				hide-details
				label="MMM SP"
			/>
			<span class="sp-builder--category-icon">
				<sp-icon
					:category="+entry.category"
					:displaySize="24"
				/>
			</span>
			<span class="sp-builder--description">
				{{ entry.skill.desc }}
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
import JsonExplorerView from '@/components/Generators/JsonExplorerView';
import SpIcon from '@/components/BF/Units/SpIcon';

export default {
	components: {
		JsonExplorerView,
		SpIcon,
	},
	data () {
		return {
			selectedEntries: [],
			visibleJsonIndices: {},
		};
	},
	methods: {
		toggleJsonIndex (index) {
			this.$set(this.visibleJsonIndices, index, !this.visibleJsonIndices[index]);
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
		spEntries () {
			this.visibleJsonIndices = {};
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
			margin: auto;

			.v-input--selection-controls__input {
				margin: auto;
			}
		}

		.sp-builder--category-icon {
			grid-area: category-icon;
			height: 24px;
			justify-self: center;
		}

		.sp-builder--description {
			grid-area: desc;
		}

		.sp-builder--json {
			grid-area: json;
		}
	}
}
</style>

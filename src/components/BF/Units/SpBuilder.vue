<template>
	<ul class="sp-builder">
		<li v-for="(entry, i) in spEntries" :key="entry.id" class="sp-builder--entry" :data-index="i">
			<v-divider v-if="i > 0" class="sp-builder--divider"/>
			<v-btn icon class="sp-builder--expansion-icon" @click="toggleJsonIndex(i)" :data-expand="visibleJsonIndices[i]">
				<v-icon>fas fa-chevron-right</v-icon>
			</v-btn>
			<v-checkbox
				class="sp-builder--checkbox"
				v-model="selectedEntries"
				:value="i"
				multiple
				hide-details
			/>
			<span class="sp-builder--category-icon">
				{{ entry.category }}
			</span>
			<span class="sp-builder--description">
				{{ entry.skill.desc }}
			</span>
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

export default {
	components: {
		JsonExplorerView,
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
		display: grid;
		grid-template-columns: auto auto auto 1fr;
		grid-template-rows: auto auto auto auto;
		grid-template-areas:	"div div div div"
													"expand checkbox category-icon desc"
													"json json json json";
		align-items: baseline;
		grid-column-gap: 1em;

		&[data-index="0"] {
			// 0th index does not have a divideer
			grid-template-rows: auto auto auto;
			grid-template-areas:	"expand checkbox category-icon desc"
														"json json json json";
		}

		.sp-builder--divider {
			grid-area: div;
		}

		.sp-builder--expansion-icon {
			grid-area: expand;

			&[data-expand=true] {
				transform: rotate(90deg);
			}
		}

		.sp-builder--checkbox {
			grid-area: checkbox;

			.v-input--selection-controls__input {
				margin: auto;
			}
		}

		.sp-builder--category-icon {
			grid-area: category-icon;
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

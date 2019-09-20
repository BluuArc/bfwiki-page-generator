<template>
	<ul class="sp-builder">
		<li v-for="(entry, i) in spEntries" :key="entry.id" class="sp-builder--entry">
			<v-btn icon class="sp-builder--expansion-icon">
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
			<json-explorer-view
				class="sp-builder--json"
				:json="entry"
				rootName="SP Entry"
			/>
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
		};
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
};
</script>

<style lang="scss">
@import "@/styles/util-mixins.scss";

ul.sp-builder {
	@include list-style-reset();

	.sp-builder--entry {
		display: grid;
		grid-template-rows: auto auto;
		grid-template-columns: auto auto auto 1fr;
		grid-template-areas:	"expand checkbox category-icon desc"
													"json json json json";
		align-items: baseline;
		grid-column-gap: 0.25em;

		.sp-builder--expansion-icon {
			grid-area: expand;
		}

		.sp-builder--checkbox {
			grid-area: checkbox;
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

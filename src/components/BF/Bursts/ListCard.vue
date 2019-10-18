<template>
	<v-card class="burst-list-card pa-3" v-bind="$attrs">
		<span class="entry-title">
			<template v-if="entry.name">
				{{ entry.name }}
			</template>
			<i v-else v-text="NO_TITLE_TEXT"/>
		</span>
		<span class="entry-description">
			<template v-if="hasDescription">
				{{ entry.desc }}
			</template>
			<i v-else v-text="NO_DESCRIPTION_TEXT"/>
		</span>
	</v-card>
</template>

<script>
export default {
	computed: {
		NO_DESCRIPTION_TEXT: () => 'No description',
		NO_TITLE_TEXT: () => 'No name',
		hasDescription () {
			const desc = this.entry.desc;
			return !!desc && desc !== 'None' && desc !== '0';
		},
	},
	props: {
		entry: {
			required: true,
			type: Object,
		},
	},
};
</script>

<style lang="scss">
.burst-list-card {
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: auto 1fr;
	// grid-template-areas:	"title rarity"
	// 											"desc desc";
	grid-row-gap: 0.5em;

	.entry-title {
		// grid-area: title;
		font-weight: bold;
	}

	// .entry-description {
	// 	grid-area: desc;
	// }

	&:hover {
		outline: 2px solid grey;
	}
}
</style>

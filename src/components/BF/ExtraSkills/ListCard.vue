<template>
	<v-card class="es-list-card pa-3" v-bind="$attrs">
		<span class="entry-title">
			<template v-if="entry.name">
				{{ entry.name }}
			</template>
			<i v-else v-text="NO_TITLE_TEXT"/>
		</span>
		<span class="entry-rarity">
			{{ entry.rarity }} <v-icon x-small right>fa-star</v-icon>
		</span>
		<span class="entry-description">
			<template v-if="entry.desc">
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
.es-list-card {
	display: grid;
	grid-template-columns: 1fr auto;
	grid-template-rows: auto 1fr;
	grid-template-areas:	"title rarity"
												"desc desc";
	grid-row-gap: 0.5em;

	.entry-title {
		grid-area: title;
		font-weight: bold;
	}

	.entry-rarity {
		grid-area: rarity;
		display: flex;
		justify-content: flex-end;
	}

	.entry-description {
		grid-area: desc;
	}

	&:hover {
		outline: 2px solid grey;
	}
}
</style>

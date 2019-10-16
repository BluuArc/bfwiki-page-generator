<template>
	<v-input
		class="unit-selector-field"
		:value="activeEntryId"
		@click="showUnitPicker = true"
	>
		<list-card
			:key="activeEntryId"
			class="my-1"
			:entry="activeEntry"
		/>
		<v-dialog
			v-model="showUnitPicker"
			fullscreen
			hide-overlay
			transition="dialog-bottom-transition"
		>
			<v-card>
				<picker @select="onSelect"/>
			</v-card>
		</v-dialog>
	</v-input>
</template>

<script>
import ListCard from './ListCard';
import Picker from './Picker';

export default {
	components: {
		ListCard,
		Picker,
	},
	data () {
		return {
			activeEntry: undefined,
			activeEntryId: undefined,
			showUnitPicker: false,
		};
	},
	methods: {
		onSelect ({ entry, id }) {
			this.activeEntry = entry;
			this.activeEntryId = id;
			this.showUnitPicker = false;
		},
	},
};
</script>

<style lang="scss">
.unit-selector-field {
	.v-input__slot > .unit-list-card {
		width: 100%;
	}
}
</style>

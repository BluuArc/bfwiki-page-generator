<template>
	<v-input
		v-bind="$attrs"
		class="unit-selector-field"
		:value="activeEntryId"
		:append-icon="appendIcon"
		@click:append="clearEntry"
		@click="showUnitPicker = true"
	>
		<list-card
			:raised="!$attrs.disabled"
			elevation="4"
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
			<v-card class="unit-selector-field--dialog-card" style="background-color: var(--background-color);">
				<v-toolbar>
					<v-btn icon @click="showUnitPicker = false" aria-label="Close Unit Picker">
						<v-icon>fa-times</v-icon>
					</v-btn>
					<v-toolbar-title>{{ selectDialogTitle }}</v-toolbar-title>
				</v-toolbar>
				<picker
					:key="activeEntryId"
					@select="onSelect"
				/>
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
	computed: {
		appendIcon () {
			return this.hasEntry ? 'fa-times' : undefined;
		},
		hasEntry () {
			return !!this.activeEntry;
		},
	},
	data () {
		return {
			activeEntry: undefined,
			activeEntryId: undefined,
			showUnitPicker: false,
		};
	},
	methods: {
		clearEntry () {
			this.activeEntry = undefined;
			this.activeEntryId = undefined;
		},
		onSelect ({ entry, id }) {
			this.activeEntry = entry;
			this.activeEntryId = id;
			this.showUnitPicker = false;
		},
	},
	props: {
		selectDialogTitle: {
			default: 'Select Unit',
			type: String,
		},
	},
	watch: {
		activeEntry (newValue) {
			this.$emit('input', newValue);
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

.unit-selector-field--dialog-card {
	display: flex;
	flex-direction: column;

	> .v-toolbar {
		flex: none;
	}

	.search-page {
		flex: 1;
	}
}
</style>

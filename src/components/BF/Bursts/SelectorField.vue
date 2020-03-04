<template>
	<v-input
		v-bind="$attrs"
		class="burst-selector-field"
		:value="activeEntryId"
		:append-icon="appendIcon"
		@click:append="clearEntry"
		@click="showBurstPicker = true"
	>
		<list-card
			:raised="!$attrs.disabled"
			elevation="4"
			:key="activeEntryId"
			class="my-1"
			:entry="activeEntry"
		/>
		<v-dialog
			v-model="showBurstPicker"
			fullscreen
			hide-overlay
			transition="dialog-bottom-transition"
		>
			<v-card class="burst-selector-field--dialog-card" style="background-color: var(--background-color);">
				<v-toolbar>
					<v-btn icon @click="showBurstPicker = false" aria-label="Close Burst Picker">
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
			showBurstPicker: false,
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
			this.showBurstPicker = false;
		},
	},
	props: {
		selectDialogTitle: {
			default: 'Select Burst',
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
.burst-selector-field {
	.v-input__slot > .burst-list-card {
		width: 100%;
	}
}

.burst-selector-field--dialog-card {
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

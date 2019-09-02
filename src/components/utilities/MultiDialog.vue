<template>
	<v-dialog
		:value="!!activeDialog"
		@input="() => activeDialog = ''"
		v-bind="$attrs"
	>
		<template v-for="slotName in slotsToExpose">
			<template v-if="activeDialog === slotName">
				<slot :name="slotName">
					<span :key="slotName">This is the slot for {{ slotName }}</span>
				</slot>
			</template>
		</template>
	</v-dialog>
</template>

<script>
export default {
	data () {
		return {
			activeDialog: '',
		};
	},
	props: {
		slotsToExpose: {
			required: true,
			type: Array,
		},
		value: {
			default: '',
			type: String,
		},
	},
	watch: {
		activeDialog (newValue) {
			if (this.value !== newValue) {
				this.$emit('input', newValue);
			}
		},
		value: {
			handler (newValue) {
				if (this.activeDialog !== newValue) {
					this.activeDialog = newValue;
				}
			},
			immediate: true,
		},
	},
};
</script>

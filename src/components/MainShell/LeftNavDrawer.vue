<template>
	<v-navigation-drawer
		v-model="showDrawer"
		app temporary
	>
		<v-list-item>
			<v-list-item-content>
				<v-list-item-title>
					BF Wiki Page Generator
				</v-list-item-title>
			</v-list-item-content>
		</v-list-item>
	</v-navigation-drawer>
</template>

<script>
export default {
	data () {
		return {
			showDrawer: false,
		};
	},
	props: {
		value: {
			default: false,
			type: Boolean,
		},
	},
	watch: {
		showDrawer (newValue) {
			if (newValue !== this.value) {
				this.$emit('input', newValue);
			}
		},
		value: {
			handler (newValue) {
				if (!!newValue !== this.showDrawer) {
					this.showDrawer = !!newValue;
				}
			},
			immediate: true,
		},
	},
};
</script>

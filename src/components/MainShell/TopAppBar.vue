<template>
	<v-app-bar app>
		<v-app-bar-nav-icon
			aria-label="Display Navigation Drawer"
			@click.stop="$emit('toggledrawer')"
		/>
		<v-toolbar-title class="headline">
			{{ toolbarTitle }}
		</v-toolbar-title>
		<v-spacer/>
		<v-divider vertical/>
		<v-btn
			aria-label="Go to the GitHub Repository"
			icon
			href="https://github.com/BluuArc/bfwiki-page-generator"
			target="_blank"
			rel="noopener"
		>
			<v-icon>fab fa-github</v-icon>
		</v-btn>
		<v-btn
			aria-label="Join the Discord Server"
			icon
			href="https://discord.gg/8rUdRfr"
			target="_blank"
			rel="noopener"
		>
			<v-icon>fab fa-discord</v-icon>
		</v-btn>
		<v-btn
			aria-label="Go to the Brave Frontier Global Wiki"
			icon
			href="https://bravefrontierglobal.fandom.com/wiki/Brave_Frontier_Wiki"
			target="_blank"
			rel="noopener"
		>
			<v-icon>fa-link</v-icon>
		</v-btn>
	</v-app-bar>
</template>

<script>
export default {
	computed: {
		toolbarTitle () {
			return this.$store.state.titleOverride || this.$route.name;
		},
	},
	watch: {
		toolbarTitle: {
			handler (newTitle) {
				if (newTitle) {
					document.title = newTitle;
				}
			},
			immediate: true,
		},
	},
};
</script>

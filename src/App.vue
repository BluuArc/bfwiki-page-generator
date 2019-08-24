<template>
	<v-app>
		<top-app-bar/>
		<v-content>
			<router-view/>
		</v-content>
	</v-app>
</template>

<script>
import TopAppBar from '@/components/MainShell/TopAppBar';

export default {
	components: {
		TopAppBar,
	},
	data: () => ({
		//
	}),
	name: 'App',
};
</script>

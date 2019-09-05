<template>
	<v-container>
		<v-layout>
			<search-area/>
		</v-layout>
		<v-layout>
			all results would go here
		</v-layout>
		<v-layout>
			pagination would go here
		</v-layout>
	</v-container>
</template>

<script>
import SearchArea from './SearchArea';
export default {
	components: {
		SearchArea,
	},
};
</script>

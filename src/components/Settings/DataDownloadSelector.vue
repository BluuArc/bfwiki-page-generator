<template>
	<ul>
		<li v-for="name in allDataEntriesByName" :key="name">
			<span>{{ name }}</span>
		</li>
	</ul>
</template>

<script>
import { DATA_MAPPING, SERVERS } from '@/utilities/constants';

export default {
	computed: {
		allDataEntriesByName () {
			return Object.keys(DATA_MAPPING)
				.map(key => DATA_MAPPING[key].name);
		},
		servers () {
			return SERVERS.slice();
		},
	},
};
</script>

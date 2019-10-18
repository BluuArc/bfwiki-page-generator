<template>
	<burst-picker
		:useLinkRedirect="true"
		:getEntryLink="getEntryLink"
	/>
</template>

<script>
import BurstPicker from '@/components/BF/Bursts/Picker';

export default {
	components: {
		BurstPicker,
	},
	methods: {
		getEntryLink (entry) {
			return `${this.$route.path}/${entry}`;
		},
	},
};
</script>

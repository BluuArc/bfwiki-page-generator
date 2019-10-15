<template>
	<unit-picker
		:useLinkRedirect="true"
		:getEntryLink="getEntryLink"
	/>
</template>

<script>
import UnitPicker from '@/components/BF/Units/Picker';

export default {
	components: {
		UnitPicker,
	},
	methods: {
		getEntryLink (entry) {
			return `${this.$route.path}/${entry}`;
		},
	},
};
</script>

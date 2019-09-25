<template>
	<v-container id="home-page-container">
		<section>
			<general-settings-card/>
		</section>
		<section class="d-flex">
			<data-download-card/>
		</section>
	</v-container>
</template>

<script>
import DataDownloadCard from '@/components/Settings/DataDownloadCard';
import GeneralSettingsCard from '@/components/Settings/GeneralSettingsCard';
export default {
	components: {
		DataDownloadCard,
		GeneralSettingsCard,
	},
	created () {
		this.$store.commit('setTitleOverride', 'BF Wiki Page Generator - Home');
	},
};
</script>

<style lang="scss">
#home-page-container section {
	margin: 1em 0;
}
</style>

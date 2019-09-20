<template>
	<ul class="sp-builder">
		<li>
			{{ spEntries }}
		</li>
	</ul>
</template>

<script>
export default {
	props: {
		spEntries: {
			required: true,
			type: Array,
		},
		value: {
			default: '',
			type: String,
		},
	},
};
</script>

<style lang="scss">
@import "@/styles/util-mixins.scss";

ul.sp-builder {
	@include list-style-reset();
}
</style>

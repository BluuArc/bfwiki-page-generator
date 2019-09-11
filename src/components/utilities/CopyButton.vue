<template>
	<v-btn
		v-bind="$attrs"
		@click="copyToClipboard"
		class="copy-button"
		:color="dataCopied ? 'green' : undefined">
		{{ currentButtonText }}
		<textarea readonly :value="value"/>
	</v-btn>
</template>

<script>
export default {
	computed: {
		currentButtonText () {
			return this.dataCopied ? this.buttonTextCopied : this.buttonText;
		},
	},
	data () {
		return {
			dataCopied: false,
		};
	},
	methods: {
		copyToClipboard () {
			const textarea = this.$el.querySelector('textarea');
			textarea.select();
			document.execCommand('Copy');
			textarea.selectionEnd = 0;
			this.dataCopied = true;
		},
	},
	props: {
		buttonText: {
			default: 'Copy to Clipboard',
			type: String,
		},
		buttonTextCopied: {
			default: 'Copied text!',
			type: String,
		},
		value: {
			default: '',
			type: String,
		},
	},
	watch: {
		value () {
			this.dataCopied = false;
		},
	},
};
</script>

<style scoped>
textarea {
	width: 1px;
	height: 1px;
	border: none;
	position: absolute;
	z-index: -1;
	left: -9999px;
}
</style>

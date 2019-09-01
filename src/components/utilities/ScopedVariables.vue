<script>
export default {
	functional: true,
	render (h, context) {
		// pass all props through into default slot
		return context.scopedSlots.default(context.props);
	},
};
</script>

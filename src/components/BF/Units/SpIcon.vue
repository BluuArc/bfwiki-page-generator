<template>
	<generic-sprite-icon
		:iconTitle="spCategory"
		:iconWidth="iconSize" :iconHeight="iconSize"
		:sheetWidth="sheetSize[0]" :sheetHeight="sheetSize[1]"
		:displayWidth="displaySize" :displayHeight="displaySize"
		:src="source"
		:iconX="xCoord" :iconY="yCoord"
	/>
</template>

<script>
import GenericSpriteIcon from '@/components/utilities/GenericSpriteIcon';
import { getSpCategoryName } from '@bluuarc/bfmt-utilities/dist/sp-enhancements';

export default {
	components: {
		GenericSpriteIcon,
	},
	computed: {
		iconSize () {
			return 32;
		},
		sheetSize () {
			return [192, 64];
		},
		source () {
			return require('@/assets/sphere_icon_hexa.png');
		},
		spCategory () {
			return getSpCategoryName(this.category);
		},
		xCoord () {
			const { category } = this;
			const index = category <= 6 ? (category - 1) : (category - 7);
			return index * this.iconSize;
		},
		yCoord () {
			return this.iconSize * (this.category <= 6 ? 0 : 1);
		},
	},
	props: {
		category: {
			required: true,
			type: Number,
		},
		displaySize: {
			default: 32,
			type: Number,
		},
	},
};
</script>

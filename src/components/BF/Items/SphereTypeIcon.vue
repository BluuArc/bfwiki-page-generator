<template>
	<generic-sprite-icon
		class="sphere-type-icon"
		:iconTitle="sphereCategory"
		:iconWidth="iconSize" :iconHeight="iconSize"
		:sheetWidth="sheetSize[0]" :sheetHeight="sheetSize[1]"
		:displayWidth="displaySize" :displayHeight="displaySize"
		:src="source"
		:iconX="xCoord" :iconY="yCoord"
	/>
</template>

<script>
import GenericSpriteIcon from '@/components/utilities/GenericSpriteIcon';
import { SphereTypeId } from '@bluuarc/bfmt-utilities/dist/datamine-types';

export default {
	components: {
		GenericSpriteIcon,
	},
	computed: {
		iconSize () {
			return 32;
		},
		sheetSize () {
			return [320, 64];
		},
		source () {
			return require('@/assets/sphere_icon.png');
		},
		sphereCategory () {
			return SphereTypeId[this.category] || SphereTypeId[0];
		},
		xCoord () {
			const { category } = this;
			const index = category <= 9 ? (category) : (category - 10);
			return index * this.iconSize;
		},
		yCoord () {
			return this.iconSize * (this.category <= 9 ? 0 : 1);
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

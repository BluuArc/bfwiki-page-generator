<template>
	<generic-sprite-icon
		class="item-icon"
		:iconWidth="iconSize" :iconHeight="iconSize"
		:displayWidth="displaySize" :displayHeight="displaySize"
		:iconTitle="itemName"
		:src="thumbnailSrc"
		:iconX="0" :iconY="0"
	>
		<image
			slot="before"
			:href="backgroundSrc"
			:width="iconSize" :height="iconSize"
			class="item-icon-background"/>
		<image
			slot="after"
			:href="frameSrc"
			:width="iconSize" :height="iconSize"
			class="item-icon-frame"/>
	</generic-sprite-icon>
</template>

<script>
import GenericSpriteIcon from '@/components/utilities/GenericSpriteIcon';
import { ITEM_TYPES_MAPPING } from '@/utilities/bf-core/constants';
export default {
	components: {
		GenericSpriteIcon,
	},
	computed: {
		backgroundSrc: () => require('@/assets/item_frame_bg2.png'),
		frameSrc () {
			const type = this.type;
			const isRaidItem = this.isRaidItem;
			if (type === ITEM_TYPES_MAPPING.CONSUMABLE && !isRaidItem) {
				return require('@/assets/item_frame_1.png');
			} else if (type === ITEM_TYPES_MAPPING.MATERIAL && !isRaidItem) {
				return require('@/assets/item_frame_2.png');
			} else if (type === ITEM_TYPES_MAPPING.SPHERE) {
				return require('@/assets/item_frame_3.png');
			} else if (type === ITEM_TYPES_MAPPING.EVOLUTION_MATERIAL) {
				return require('@/assets/item_frame_4.png');
			} else if (type === ITEM_TYPES_MAPPING.SUMMONER_CONSUMABLE) {
				return require('@/assets/item_frame_6.png');
			} else if (isRaidItem) {
				return require('@/assets/item_frame_5.png');
			} else if (type === ITEM_TYPES_MAPPING.LS_SPHERE) {
				return require('@/assets/item_frame_7.png');
			} else {
				return require('@/assets/item_frame_0.png');
			}
		},
		iconSize: () => 102,
	},
	props: {
		displaySize: {
			default: 102,
			type: Number,
		},
		isRaidItem: {
			default: false,
			type: Boolean,
		},
		itemName: {
			default: '',
			type: String,
		},
		itemType: {
			default: '',
			type: String,
		},
		thumbnailSrc: {
			required: true,
			type: String,
		},
	},
};
</script>

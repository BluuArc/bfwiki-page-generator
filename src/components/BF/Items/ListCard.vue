<template>
	<v-card class="item-list-card pa-3" v-bind="$attrs">
		<item-icon
			class="item-image"
			:thumbnailSrc="imageUrl"
			:itemName="name"
			:displaySize="56"
			:itemType="entry.type"
			:isRaidItem="!!entry.raid"
		/>
		<span class="item-title" v-text="name"/>
		<span class="item-description">{{ entry.desc }}</span>
		<v-layout class="item-details" align-baseline>
			<v-flex style="flex: none;" class="item-type">
				<span v-if="hasSphereType" class="item-list-card--sphere-icon-wrapper pr-1">
					<sphere-type-icon
						:category="entry['sphere type']"
						:displaySize="20"
					/>
				</span>
				{{ formattedItemType }}
			</v-flex>
			<v-flex style="justify-self: end; flex: none; display: flex; align-items: center;">
				{{ entry.rarity }} <v-icon x-small right>fa-star</v-icon>
			</v-flex>
		</v-layout>
	</v-card>
</template>

<script>
import { DEFAULT_CONTENT_URLS } from '@/utilities/constants';
import { ITEM_TYPES_NAMES_MAPPING } from '@/utilities/bf-core/constants';
import ItemIcon from './ItemIcon';
import SphereTypeIcon from './SphereTypeIcon';
import { SphereTypeId } from '@bluuarc/bfmt-utilities/dist/datamine-types';
import appLocalStorageStore from '@/utilities/AppLocalStorageStore';
import { getImageUrl } from '@/utilities/bf-core/items';

export default {
	components: {
		ItemIcon,
		SphereTypeIcon,
	},
	computed: {
		formattedItemType () {
			const type = this.entry.type || '';
			const formattedType = ITEM_TYPES_NAMES_MAPPING[type] || type;
			return this.sphereType ? `${this.sphereType} ${formattedType}` : formattedType;
		},
		hasSphereType () {
			return this.entry.hasOwnProperty('sphere type');
		},
		imageUrl () {
			const server = appLocalStorageStore.serverName;
			const baseUrl = appLocalStorageStore.getUrlForServer(server) || DEFAULT_CONTENT_URLS[server];
			return getImageUrl(baseUrl, this.entry.thumbnail);
		},
		name () {
			return `${this.entry.name} (${this.entry.id})`;
		},
		sphereType () {
			const sphereType = this.entry['sphere type'];
			return !isNaN(sphereType) ? (SphereTypeId[sphereType] || SphereTypeId[0]) : '';
		},
	},
	props: {
		entry: {
			required: true,
			type: Object,
		},
	},
};
</script>

<style lang="scss">
.item-list-card {
	display: grid;
	grid-template-columns: 56px 1fr;
	grid-template-rows: auto 1fr auto;
	grid-template-areas:	"title title"
												"img description"
												"details details";
	grid-column-gap: 0.5em;

	.item-type {
		display: flex;
		align-items: center;
		align-self: end;
	}

	.item-list-card--sphere-icon-wrapper {
		display: flex;
	}

	.item-image {
		grid-area: img;
		width: 56px;
		height: 56px;
		align-self: center;
	}

	.item-description {
		grid-area: description;
		align-self: baseline;
	}

	.item-title {
		grid-area: title;
		font-weight: bold;
	}

	.item-details {
		grid-area: details;
		justify-content: space-between;
	}

	&:hover {
		outline: 2px solid grey;
	}
}
</style>

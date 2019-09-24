<template>
	<v-card class="item-list-card pa-3" v-bind="$attrs">
		<item-icon
			class="item-image"
			:thumbnailSrc="imageUrl"
			:itemName="name"
			:displaySize="56"
			:itemType="itemType"
			:isRaidItem="!!entry.raid"
		/>
		<span class="item-title" v-text="name"/>
		<span class="item-description">{{ entry.desc }}</span>
		<v-layout class="item-details" align-baseline>
			<v-flex style="flex: none;">
				<span v-if="hasSphereType">
					{{ entry['sphere type'] }}
				</span>
				{{ itemType }}
			</v-flex>
			<v-flex style="justify-self: end; flex: none;">
				{{ entry.rarity }} <v-icon x-small right>fa-star</v-icon>
			</v-flex>
		</v-layout>
	</v-card>
</template>

<script>
import { DEFAULT_CONTENT_URLS } from '@/utilities/constants';
import ItemIcon from './ItemIcon';
import appLocalStorageStore from '@/utilities/AppLocalStorageStore';
import { getImageUrl } from '@/utilities/bf-core/items';

export default {
	components: {
		ItemIcon,
	},
	computed: {
		hasSphereType () {
			return this.entry.hasOwnProperty('sphere type');
		},
		imageUrl () {
			const server = appLocalStorageStore.serverName;
			const baseUrl = appLocalStorageStore.getUrlForServer(server) || DEFAULT_CONTENT_URLS[server];
			return getImageUrl(baseUrl, this.entry.thumbnail);
		},
		itemType () {
			const type = this.entry.type || '';
			return `${(type[0] || '').toUpperCase()}${type.slice(1)}`;
		},
		name () {
			return `${this.entry.name} (${this.entry.id})`;
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

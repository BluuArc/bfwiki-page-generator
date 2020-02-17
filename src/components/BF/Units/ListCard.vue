<template>
	<v-card :class="cardClass" v-bind="$attrs">
		<img class="unit-image" :src="imageUrl"/>
		<span class="unit-title" v-text="name"/>
		<v-layout class="unit-details" align-baseline>
			<v-flex style="flex: none;">
				{{ guideId }}
			</v-flex>
			<v-flex style="justify-self: end; flex: none;">
				{{ rarity }} <v-icon x-small right>fa-star</v-icon>
			</v-flex>
		</v-layout>
	</v-card>
</template>

<script>
import { DEFAULT_CONTENT_URLS } from '@/utilities/constants';
import appLocalStorageStore from '@/utilities/AppLocalStorageStore';
import { getImageUrls } from '@/utilities/bf-core/units';

const getEmptyUnit = () => ({
	element: null,
	empty: true,
	guide_id: 0,
	id: 0,
	name: 'Empty',
	rarity: 0,
});

const UNIT_FRAME_URLS = Object.freeze({
	COMMON: require('@/assets/question_frame_1.png'),
	MEGA_RARE: require('@/assets/question_frame_4.png'),
	RARE: require('@/assets/question_frame_2.png'),
	SUPER_RARE: require('@/assets/question_frame_3.png'),
});

export default {
	computed: {
		cardClass () {
			const baseClasses = {
				'pa-3': true,
				'unit-list-card': true,
			};
			if (this.entry.element) {
				baseClasses[this.entry.element] = true;
			}
			return baseClasses;
		},
		entryId () {
			return this.entry.id;
		},
		guideId () {
			return `#${this.entry.guide_id}`;
		},
		imageUrl () {
			const server = appLocalStorageStore.serverName;
			const baseUrl = appLocalStorageStore.getUrlForServer(server) || DEFAULT_CONTENT_URLS[server];
			const { entryId } = this;
			return entryId > 0 ? getImageUrls(entryId, baseUrl).ills_thum : this.getUnitFrameUrlForRarity(this.rarity);
		},
		name () {
			return `${this.entry.name} (${this.entryId})`;
		},
		rarity () {
			return this.entry.rarity;
		},
	},
	methods: {
		getUnitFrameUrlForRarity (rarity) {
			const numericalRarity = +rarity;
			let frameUrl;
			if (numericalRarity >= 5) {
				frameUrl = UNIT_FRAME_URLS.MEGA_RARE;
			} else if (numericalRarity >= 4) {
				frameUrl = UNIT_FRAME_URLS.SUPER_RARE;
			} else if (numericalRarity >= 3) {
				frameUrl = UNIT_FRAME_URLS.RARE;
			} else {
				frameUrl = UNIT_FRAME_URLS.COMMON;
			}
			return frameUrl;
		},
	},
	props: {
		entry: {
			default: () => getEmptyUnit(),
			type: Object,
		},
	},
};
</script>

<style lang="scss">
.unit-list-card {
	display: grid;
	grid-template-columns: 56px 1fr;
	grid-template-rows: 1fr 1fr;
	grid-template-areas:	"img title"
												"img details";
	grid-column-gap: 0.5em;
	cursor: pointer;

	.unit-image {
		grid-area: img;
		width: 56px;
		height: 56px;
	}

	.unit-title {
		grid-area: title;
		font-weight: bold;
	}

	.unit-details {
		grid-area: details;
		justify-content: space-between;
	}

	&:hover {
		outline-width: 2px;
		outline-style: solid;
		&.fire {
			outline-color: #F44336; // red
		}
		&.water {
			outline-color: #2196F3; // blue
		}
		&.earth {
			outline-color: #4CAF50; // green
		}
		&.thunder {
			outline-color: #FFC107; // amber
		}
		&.light {
			outline-color: #9E9E9E; // grey
		}
		&.dark {
			outline-color: #9C27B0; // purple
		}
	}
}
</style>

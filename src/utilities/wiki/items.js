import {
	DATA_MAPPING,
	SERVER_NAME_MAPPING,
} from '@/utilities/constants';
import {
	generateRarityString,
	generateTemplateBody,
} from './utils';
import { ItemType } from '@bluuarc/bfmt-utilities/dist/datamine-types';
import appLocalStorageStore from '@/utilities/AppLocalStorageStore';
import bfDatabase from '@/utilities/BfDatabase/index.client';
import getLogger from '@/utilities/Logger';

const WIKI_TABLE_CHUNK_SIZE = 70;
const logger = getLogger('generateItemTemplate');

/**
 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').IItem} item
 * @returns {Promise<import('./utils').WikiDataPair[]>}
 */
async function generateFlavorText (item) {
	let lore = '';
	try {
		const itemId = item.id;
		const keys = ['ITEMS_BATTLEITEMS', 'ITEMS_MATERIAL', 'LSSPHERE', 'SPHERES'];
		const dictionaryKeys = keys.reduce((acc, key) => {
			acc[key] = `MST_${key}_${itemId}_LONGDESCRIPTION`;
			return acc;
		}, {});
		const dictionaryData = await bfDatabase.then(worker => worker.getByIds({
			extractedFields: ['en'],
			ids: Object.values(dictionaryKeys),
			server: appLocalStorageStore.serverName,
			table: DATA_MAPPING.dictionary.key,
		}));
		lore = Object.values(dictionaryData).reduce((acc, val) => acc || (val && val.en) || '', '');
	} catch (e) {
		logger.error('Error grabbing lore data', e);
		lore = '';
	}
	return [['|longDescription', lore]];
}

/**
 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').IItemRecipeMaterial[]} materials
 * @returns {Promise<import('./utils').WikiDataPair[]>}
 */
async function generateCraftMats (materials) {
	const result = [];
	if (Array.isArray(materials) && materials.length > 0) {
		const craftDb = await bfDatabase.then(worker => worker.getByIds({
			extractedFields: ['name'],
			ids: materials.map(entry => entry.id),
			server: appLocalStorageStore.serverName,
			table: DATA_MAPPING.items.key,
		}));

		result.push([
			'|craftMats',
			materials.map(m => `${(craftDb[m.id] && craftDb[m.id].name) || m.id},${m.count}`).join(';'),
		]);
	}
	return result;
}

/**
 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').IItem} item
 * @returns {Promise<import('./utils').WikiDataPair[]>}
 */
async function generateBaseTotalMats (item) {
	/**
	 * @type {import('@bluuarc/bfmt-utilities/dist/datamine-types').IItemRecipeMaterial[]}
	 */
	const baseMaterials = await bfDatabase.then(worker => worker.getBaseMaterialsOfItem({
		id: item.id,
		server: appLocalStorageStore.serverName,
	}));
	baseMaterials.sort((a, b) => a.name.localeCompare(b.name));
	const results = [];

	// split into chunks of even sizes
	const numMaterials = baseMaterials.length;
	const numberOfChunks = Math.ceil(numMaterials / WIKI_TABLE_CHUNK_SIZE);
	const chunkSize = Math.ceil(numMaterials / Math.max(numberOfChunks, 1));
	for (let i = 0; i < numberOfChunks; ++i) {
		const startIndex = i * chunkSize;
		const chunk = baseMaterials.slice(startIndex, startIndex + chunkSize);
		results.push([
			`|baseTotalMats${i !== 0 ? (i + 1) : ''}`,
			chunk.map(m => `${m.name},${m.count}`).join(';'),
		]);
	}
	return results;
}

/**
 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').IItem} item
 * @returns {Promise<import('./utils').WikiDataPair[]>}
 */
async function generateCraftInto (item) {
	/**
	 * @type {import('@bluuarc/bfmt-utilities/dist/datamine-types').IItemRecipeMaterial[]}
	 */
	const requiringItems = await bfDatabase.then(worker => worker.getImmediateUsageForItem({
		id: item.id,
		server: appLocalStorageStore.serverName,
	}));
	const results = [];
	if (requiringItems.length > 0) {
		const transformedValues = requiringItems
			.map(m => `${m.name},${m.count}`)
			.sort((a, b) => a.localeCompare(b))
			.join(';');
		results.push([
			'|craftInto',
			transformedValues,
		]);
	}
	return results;
}

/**
 * @param {import('@bluuarc/bfmt-utilities/dist/datamine-types').IItem|import('@bluuarc/bfmt-utilities/dist/datamine-types').ISphere} item
 */
export async function generateItemTemplate (item) {
	const isEuropeServer = appLocalStorageStore.serverName === SERVER_NAME_MAPPING.Europe;
	/**
	 * @type {import('./utils').WikiDataPair}
	 */
	const templateData = [
		['|unreleased', ''],
		...(isEuropeServer ? [['|guide_id', item.id]] : []),
		['|type', (item.type || '').replace(/_/g, '')],
		['|sphereType', item['sphere type text'] || ''],
		['|rarity', generateRarityString(item.rarity)],
		['|element', ''],
		...(await generateFlavorText(item)),
		['|shortDescription', item.desc || ''],
		['|effectNotes', ''],
		['|image', item.thumbnail || ''],
		['|craftLvl', ''],
		['|craftCost', (item.recipe && item.recipe.karma) || ''],
		['|sellValue', item.sell_price],
		['|esunit', ''],
		...(await generateCraftMats(item.recipe && item.recipe.materials)),
		['|carryLimit', (item.type !== ItemType.Sphere && item.max_stack) || ''],
		...(await generateCraftInto(item)),
		['|raidonly', item.raid || ''],
		['|howToObtain', ''],
		['|notes', ''],
		...(await generateBaseTotalMats(item)),
		['|incorrectinfo', ''],
	];
	const templateName = !isEuropeServer ? 'Item' : 'ItemEU';
	return `{{{{#if:{{{1|}}}|ItemProp|${templateName}}}|prop={{{1|}}}
${generateTemplateBody(templateData)}
}}`;
}

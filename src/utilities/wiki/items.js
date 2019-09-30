import {
	generateRarityString,
	generateTemplateBody,
} from './utils';
import { DATA_MAPPING } from '@/utilities/constants';
import { ITEM_TYPES_MAPPING } from '@/utilities/bf-core/constants';
import appLocalStorageStore from '@/utilities/AppLocalStorageStore';
import bfDatabase from '@/utilities/BfDatabase/index.client';

const WIKI_TABLE_CHUNK_SIZE = 70;

/**
 * @param {object} item
 * @returns {Promise<import('./utils').WikiDataPair[]>}
 */
async function generateFlavorText (item) {
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
	const lore = Object.values(dictionaryData).reduce((acc, val) => acc || (val && val.en) || '', '');
	return [['|longDescription', lore]];
}

/**
 * @param {Array<{ count: number, id: number }>} materials
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
 * @param {object} item
 * @returns {Promise<import('./utils').WikiDataPair[]>}
 */
async function generateBaseTotalMats (item) {
	/**
	 * @type {Array<{ name: string, id: string|number, count: number }>}
	 */
	const baseMaterials = await bfDatabase.then(worker => worker.getBaseMaterialsOfItem({
		id: item.id,
		server: appLocalStorageStore.serverName,
	}));
	baseMaterials.sort((a, b) => a.name.localeCompare(b.name));
	const results = [];
	const numberOfChunks = Math.ceil(baseMaterials.length / WIKI_TABLE_CHUNK_SIZE);
	for (let i = 0; i < numberOfChunks; ++i) {
		const startIndex = i * WIKI_TABLE_CHUNK_SIZE;
		const chunk = baseMaterials.slice(startIndex, startIndex + WIKI_TABLE_CHUNK_SIZE);
		results.push([
			`|baseTotalMats${i !== 0 ? (i + 1) : ''}`,
			chunk.map(m => `${m.name},${m.count}`).join(';'),
		]);
	}
	return results;
}

/**
 * @param {object} item
 */
export async function generateItemTemplate (item) {
	/**
	 * @type {import('./utils').WikiDataPair}
	 */
	const templateData = [
		['|unreleased', ''],
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
		['|carryLimit', (item.type !== ITEM_TYPES_MAPPING.SPHERE && item.max_stack) || ''],
		['|craftInto', ''], // TODO
		['|raidonly', item.raid || ''],
		['|howToObtain', ''],
		['|notes', ''],
		...(await generateBaseTotalMats(item)),
		['|incorrectinfo', ''],
	];
	return `{{{{#if:{{{1|}}}|ItemProp|Item}}|prop={{{1|}}}
${generateTemplateBody(templateData)}
}}`;
}

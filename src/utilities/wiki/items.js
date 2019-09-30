import {
	generateRarityString,
	generateTemplateBody,
} from './utils';
import { DATA_MAPPING } from '@/utilities/constants';
import { ITEM_TYPES_MAPPING } from '@/utilities/bf-core/constants';
import appLocalStorageStore from '@/utilities/AppLocalStorageStore';
import bfDatabase from '@/utilities/BfDatabase/index.client';

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
 * @param {object} item
 */
export async function generateItemTemplate (item) {
	/**
	 * @type {import('./utils').WikiDataPair}
	 */
	const templateData = [
		['|unreleased', ''],
		['|type', item.type || ''],
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
		['|craftMats', ''], // TODO: pull from item.recipe.materials
		['|carryLimit', (item.type !== ITEM_TYPES_MAPPING.SPHERE && item.max_stack) || ''],
		['|craftInto', ''],
		['|raidonly', item.raid || ''],
		['|howToObtain', ''],
		['|notes', ''],
		['|baseTotalMats', ''],
		['|incorrectinfo', ''],
	];
	return `{{{{#if:{{{1|}}}|ItemProp|Item}}|prop={{{1|}}}
${generateTemplateBody(templateData)}
}}`;
}

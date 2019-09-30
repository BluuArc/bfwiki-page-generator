import {
	generateRarityString,
	generateTemplateBody,
} from './utils';
import { ITEM_TYPES_MAPPING } from '@/utilities/bf-core/constants';

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
		['|longDescription', ''], // TODO: pull from dictionary
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

import {
	generateRarityString,
	generateTemplateBody,
} from './utils';

/**
 * @param {object} skill
 * @param {string[]?} series
 */
export async function generateExtraSkillTemplate (skill, series = []) {
	/**
	 * @type {import('./utils').WikiDataPair}
	 */
	const templateData = [
		['|id', skill.id],
		['|rarity', generateRarityString(+skill.rarity)],
		['|es', skill.name || ''],
		['|esdescription', skill.desc || ''],
		['|esnote', ''],
		['|howtoget', ''],
		['|notes', ''],
	];

	const seriesOutput = series.map(s => `{{ElgifCategory:${s}}}`).join('');
	return `{{Elgif
${generateTemplateBody(templateData)}
}}${seriesOutput}`;
}

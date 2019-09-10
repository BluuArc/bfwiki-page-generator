import { getHighestRarityUnit } from './units';
/**
 * @param {object} effect
 */
export function parseExtraSkillConditions (effect) {
	const parsedConditions = {
		item: [],
		sphereType: [],
		unit: [],
	};
	if (!effect.conditions || effect.conditions.length === 0) {
		return parsedConditions;
	}

	effect.conditions.forEach(condition => {
		if (condition['sphere category required'] !== undefined) {
			// parsedConditions.sphereType.push(`${condition['sphere category required']} sphere`);
			parsedConditions.sphereType.push(condition['sphere category required (raw)']);
		} else if (condition['item required'] !== undefined) {
			if (Array.isArray(condition['item required']) && condition['item required'].length > 0) {
				condition['item required'].forEach(item => {
					if (!parsedConditions.item.includes(item)) {
						parsedConditions.item.push(item);
					}
				});
			} else {
				parsedConditions.item.push(condition['item required']);
			}
		} else if (condition['unit required'] !== undefined) {
			if (Array.isArray(condition['unit required']) && condition['unit required'].length > 0) {
				condition['unit required'].forEach(unit => {
					if (!parsedConditions.unit.includes(unit)) {
						parsedConditions.unit.push(unit);
					}
				});
			} else {
				parsedConditions.unit.push(condition['unit required']);
			}
		} else if (condition.unknown !== undefined) {
			parsedConditions.item.push(`unknown sphere type ${condition['unknown']}`);
		}
	});

	return parsedConditions;
}

/**
 * @param {Array} units
 * @param {function(): Promise<object>} unitById
 * @returns {Promise<Array<string>>}
 */
export async function conditionHelperGetUnitNames (units = [], unitById) {
	const namesResults = await Promise.all(units.map(async (entry) => {
		const names = [];
		if (entry.name) {
			names.push(entry.name);
		} else {
			const id = (entry.id) ? entry.id.toString() : entry.toString();
			if (+id % 10 === 0) {
				const unit = (await getHighestRarityUnit(+id, unitById)) || {};
				names.push(`any evolution of ${unit.name || id}`);
			} else {
				// specify a specific unit
				const unit = (await unitById(id)) || {};
				names.push(unit.name || id);
			}
		}
		return names;
	}));
	return namesResults.reduce((acc, names) => acc.concat(...names), []);
}

/**
 * @param {Array} items
 * @param {function(): Promise<object>} itemById
 * @returns {Promise<Array<string>>}
 */
export function conditionHelperGetItemNames (items = [], itemById) {
	const results = [];
	return items.map(async (id) => {
		const item = await itemById(id.toString()) || {};
		return item.name || id;
	}).reduce((acc, getItemPromise) => {
		return acc.then(() => getItemPromise)
			.then((item) => {
				results.push(item);
			});
	}).then(() => results);
}

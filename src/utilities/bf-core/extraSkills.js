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
 * @returns {Array<string>}
 */
export function conditionHelperGetUnitNames (units = [], unitById) {
	return units.map(entry => {
		const names = [];
		if (entry.name) {
			names.push(entry.name);
		} else {
			const id = (entry.id) ? entry.id.toString() : entry.toString();
			if (+id % 10 === 0) {
				const unit = getHighestRarityUnit(+id, unitById) || {};
				names.push(`any evolution of ${unit.name || id}`);
			} else {
				// specify a specific unit
				const unit = unitById(id) || {};
				names.push(unit.name || id);
			}
		}
		return names;
	}).reduce((acc, val) => acc.concat(val), []);
}

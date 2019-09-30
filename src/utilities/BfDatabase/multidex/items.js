/**
 * @param {object} item
 * @param {object} db
 * @returns {{ [id: string]: number }} count of each item required by ID
 */
export async function getCraftablesInRecipeOfItem (item, db = {}) {
	const currentCraftables = {};
	const getCraftablesInRecipeOf = (item) => {
		if (item && item.recipe && Array.isArray(item.recipe.materials)) {
			item.recipe.materials.forEach(material => {
				const currentItem = db[material.id];
				const currentItemId = currentItem.id.toString();
				if (currentItem.recipe) {
					if (!currentCraftables[currentItemId]) {
						currentCraftables[currentItemId] = 0;
					}
					currentCraftables[currentItemId] += +material.count;
					getCraftablesInRecipeOf(currentItem);
				}
			});
		}
		return currentCraftables;
	};
	return getCraftablesInRecipeOf(item);
}

/**
 * @param {object} item
 * @param {object} db
 * @returns {{ materials: { [id: string]: number }, karma: number }} count of each item required by ID
 */
export function getBaseMaterialsOfItem (item, db = {}) {
	const getBaseMaterialsOf = (item) => {
		const result = {
			// key = item id, value = count needed
			karma: 0,
			materials: {},
		};

		if (!item.recipe) {
			return result;
		}

		result.karma += +item.recipe.karma;
		item.recipe.materials.forEach(material => {
			const currentItem = db[material.id];
			const currentItemId = currentItem.id.toString();
			const count = +material.count;
			if (currentItem.recipe) {
				// get base materials of current material
				const materialRecipe = getBaseMaterialsOf(currentItem);
				Object.keys(materialRecipe.materials).forEach(baseMaterialId => {
					if (isNaN(result.materials[baseMaterialId])) {
						result.materials[baseMaterialId] = 0;
					}

					// add count based on amount needed
					result.karma += (count * +currentItem.recipe.karma);
					result.materials[baseMaterialId] += (count * materialRecipe.materials[baseMaterialId]);
				});
			} else { // found a base material
				if (!result.materials[currentItemId]) {
					result.materials[currentItemId] = 0;
				}
				result.materials[currentItemId] += count;
			}
		});
		return result;
	};
	return getBaseMaterialsOf(item);
}

/**
 * @param {object} item
 * @param {object} db
 * @returns {{ count: number, id: number, name: string }[]}
 */
export function getImmediateUsageForItem (item, db = {}) {
	const results = [];
	if (item) {
		const id = +item.id;
		const requiringItems = Object.values(db)
			.filter(i => i.recipe &&
				i.recipe.materials &&
				i.recipe.materials.some(material => +material.id === id)
			).map(i => ({
				count: i.recipe.materials.find(m => +m.id === id).count,
				id: i.id,
				name: i.name || i.id,
			}));
		results.push(...requiringItems);
	}
	return results;
}

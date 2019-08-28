/**
 * @param {*} instance
 * @returns {object}
 */
export function convertClassInstanceToObject (instance) {
	const propsToAdd = Object.getOwnPropertyNames(Object.getPrototypeOf(instance))
		.filter(name => !name.startsWith('_') && name !== 'constructor');
	return propsToAdd.reduce((acc, name) => {
		if (typeof instance[name] === 'function') {
			acc[name] = (...args) => instance[name](...args);
		} else {
			acc[name] = () => instance[name];
		}
		return acc;
	}, {});
}

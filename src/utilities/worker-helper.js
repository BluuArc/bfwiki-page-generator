/**
 * @param {*} instance
 * @returns {object}
 */
export function convertClassInstanceToObject (instance) {
	let propsToAdd = [];
	let curPrototype = !!instance && Object.getPrototypeOf(instance);
	while (curPrototype && curPrototype !== Object.prototype) {
		propsToAdd = propsToAdd.concat(
			Object.getOwnPropertyNames(curPrototype)
				.filter(name => !name.startsWith('_') && name !== 'constructor')
		);
		curPrototype = Object.getPrototypeOf(curPrototype);
	}
	return propsToAdd.reduce((acc, name) => {
		if (typeof instance[name] === 'function') {
			acc[name] = (...args) => instance[name](...args);
		} else {
			acc[name] = () => instance[name];
		}
		return acc;
	}, {});
}

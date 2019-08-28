export default class AbstractClass {
	/**
	 * @type {string} methodName
	 * @throws {TypeError}
	 */
	_deferMethod (methodName) {
		throw new TypeError(`Method [${AbstractClass.name}.${methodName}] must be implemented in subclass`);
	}
}

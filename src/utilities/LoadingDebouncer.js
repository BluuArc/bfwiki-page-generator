
/**
 * @desc Main usage is for loading flags that control when to show loading indicators.
 * Intended to prevent display flickering when the loading flag flips constantly
 */
export default class LoadingDebouncer {
	/**
	 * @param {function(val: boolean): void} setter sets the value of the target given a value
	 * @param {number?} [delay=150] delay in ms before flipping to false
	 * @param {boolean?} [falsePriority=false] determines whether to immediately set if the value is falsy
	 */
	constructor (setter, delay = 150, falsePriority = false) {
		this._delay = delay;
		this._timeout = null;
		this._setter = (val) => setter(val);
		this._falsePriority = !!falsePriority;
	}

	/**
	 * @param {function(): boolean} valueGetter synchronous getter that gets current boolean value when evaluated
	 * @param {boolean?} [immediatelySet=false] determines whether to immediately set value
	 */
	setValue (valueGetter, immediatelySet = false) {
		// debounce timeout
		if (this._timeout) {
			clearTimeout(this._timeout);
		}

		const currentValue = !!valueGetter();
		const shouldSetNow = !!immediatelySet ||
			(currentValue && !this._falsePriority) || // truthy priority
			(!currentValue && this._falsePriority); // falsy priority
		if (shouldSetNow) {
			this._setter(currentValue);
		} else {
			this._timeout = setTimeout(() => {
				this._setter(!!valueGetter());
			}, this._delay);
		}
	}

	dispose () {
		if (this._timeout) {
			clearTimeout(this._timeout);
		}
	}
}

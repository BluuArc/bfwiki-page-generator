import { isDebugMode } from '@/utilities/LocalStorageStoreInstance';

function noop () {}

// console functions that can be passed a '[MY_KEY]' string at the beginning
const KEYED_LOGGING_FUNCTIONS = [
	'info',
	'log',
	'error',
	'warn',
	'debug',
];

const DEFAULT_STYLING = 'font-weight:bold;background:black;color:white;text-decoration:underline;';

/**
 * @type {Map<string, Console>}
 */
const proxyMapping = new Map();

/**
 * @param {string} key
 * @param {string} styling CSS Styling of key
 */
export default function getLogger (key, styling = DEFAULT_STYLING) {
	let logger = proxyMapping.get(key);
	if (!logger) {
		logger = new Proxy(console, {
			get (obj, prop) {
				const isKeyedLoggingProp = KEYED_LOGGING_FUNCTIONS.includes(prop);
				const isDebugProp = prop === 'debug';
				if (isKeyedLoggingProp && (isDebugProp || isDebugMode())) {
					/**
					 * @type {Function}
					 */
					const originalFunction = obj[prop];

					// bind to self.console to get proper line number and source file
					return originalFunction.bind(self.console, `%c[${key}:${prop}]`, styling);
				} else if (isDebugProp) {
					return noop;
				} else {
					return obj[prop];
				}
			},
		});
		proxyMapping.set(key, logger);
	}
	return logger;
}

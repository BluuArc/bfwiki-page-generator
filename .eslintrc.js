const LEVEL_ERROR = 'error';

module.exports = {
	root: true,
	env: {
		node: true,
		browser: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:vue/essential',
		'@vue/standard',
	],
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? LEVEL_ERROR : 'warn',
		'no-debugger': process.env.NODE_ENV === 'production' ? LEVEL_ERROR : 'warn',
		'indent': [
			LEVEL_ERROR,
			'tab',
		],
		'linebreak-style': [
			LEVEL_ERROR,
			'unix',
		],
		'quotes': [
			LEVEL_ERROR,
			'single',
		],
		'semi': [
			LEVEL_ERROR,
			'always',
		],
		'comma-dangle': [
			LEVEL_ERROR,
			'always-multiline',
		],
		'no-tabs': 'off',
	},
	parserOptions: {
		parser: 'babel-eslint',
	},
};

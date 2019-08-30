const LEVEL_ERROR = 'error';

module.exports = {
	env: {
		browser: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:vue/essential',
		'@vue/standard',
	],
	parserOptions: {
		parser: 'babel-eslint',
	},
	root: true,
	rules: {
		'comma-dangle': [
			LEVEL_ERROR,
			'always-multiline',
		],
		'indent': [
			LEVEL_ERROR,
			'tab',
		],
		'linebreak-style': [
			LEVEL_ERROR,
			'unix',
		],
		'no-console': process.env.NODE_ENV === 'production' ? LEVEL_ERROR : 'warn',
		'no-debugger': process.env.NODE_ENV === 'production' ? LEVEL_ERROR : 'warn',
		'no-tabs': 'off',
		'quotes': [
			LEVEL_ERROR,
			'single',
		],
		'semi': [
			LEVEL_ERROR,
			'always',
		],
		'sort-imports': LEVEL_ERROR,
		'sort-keys': LEVEL_ERROR,
	},
};

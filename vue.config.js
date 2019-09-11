const ThreadsPlugin = require('threads-plugin');

module.exports = {
	configureWebpack: config => {
		if (process.env.NODE_ENV !== 'production') {
			// custom output config to allow HMR on workers
			// according to https://github.com/developit/workerize-loader/blob/85f956551cb9963eb2414ea19e82d615fe4aa79a/src/index.js#L56
			config.output = config.output || {};
			config.output.library = 'bfwiki-page-generator';
			config.output.libraryExport = 'default';
			config.output.libraryTarget = 'self';
		}
		config.plugins.unshift(new ThreadsPlugin());
	},
	outputDir: 'dist/bfwiki-page-generator',
	publicPath: './',
};

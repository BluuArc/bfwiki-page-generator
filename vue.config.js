module.exports = {
	publicPath: './',
	configureWebpack: config => {
		if (process.env.NODE_ENV !== 'production') {
			// custom output config to allow HMR on workers
			// according to https://github.com/developit/workerize-loader/blob/85f956551cb9963eb2414ea19e82d615fe4aa79a/src/index.js#L56
			config.output = config.output || {};
			config.output.library = 'bfwiki-page-generator';
			config.output.libraryExport = 'default';
			config.output.libraryTarget = 'self';
		}
	},
	outputDir: 'dist/bf-wiki-page-generator',
};

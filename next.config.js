const path = require('path');
const withImages = require('next-images');
module.exports = withImages({
	webpack5: true,
	exclude: path.resolve(__dirname, 'public/icons'),
	webpack(config, options) {
		config.module.rules.push({
			test: /\.svg$/,
			include: path.resolve(__dirname, 'public/icons'),
			use: ["@svgr/webpack"]
		});

		return config;
	},
	env: {
		DB_URL: process.env.DB_URL,
	},
	// i18n: {
	// 	locales: ['en', 'es'],
	// 	defaultLocale: 'es',
	// },
});

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './js/app.js',
  mode: 'production',
  output: {
	path: `${__dirname}/dist`,
	filename: 'bundle.js',
  },
  plugins: [new MiniCssExtractPlugin()],
  module: {
	rules: [
	  {
		test: /\.css$/,
		use: [
		  MiniCssExtractPlugin.loader,
		  'css-loader',
		],
	  },
	  {
		test: /\.(svg|gif|png|eot|woff|ttf)$/,
		use: [
		  'url-loader',
		],
	  },
	],
  },
};
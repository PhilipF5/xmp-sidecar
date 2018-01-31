module.exports = {
	entry: './src/xmp-sidecars.ts',
	output: {
		filename: 'xmp-sidecars.js',
		path: __dirname
	},
	resolve: {
		extensions: [".ts", ".js"]
	},
	module: {
		loaders: [{ test: /\.ts$/, loader: "ts-loader" }]
	}
};
module.exports = {
	entry: './src/xmp-sidecar.ts',
	output: {
		filename: 'xmp-sidecar.js',
		path: __dirname
	},
	resolve: {
		extensions: [".ts", ".js"]
	},
	module: {
		loaders: [{ test: /\.ts$/, loader: "ts-loader" }]
	}
};
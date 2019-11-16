module.exports = {
	entry: "./src/XmpSidecar.ts",
	output: {
		filename: "XmpSidecar.js",
		path: __dirname,
		library: "XmpSidecar",
		libraryTarget: "commonjs",
	},
	resolve: {
		extensions: [".ts", ".js"],
	},
	module: {
		loaders: [{ test: /\.ts$/, loader: "ts-loader" }],
	},
	externals: {
		fs: "fs",
		path: "path",
		xml2js: "xml2js",
	},
};

import webpack from "webpack";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
	entry: ["./src/"],
	target: ["browserslist"],
	output: {
		filename: "[name].min.js",
		path: path.resolve(__dirname, "dist"),
		library: "webdfu",
		libraryTarget: "umd",
	},
	// Loaders
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: {
					loader: "ts-loader",
				},
				exclude: [/node_modules/],
			},
		],
	},
	resolve: {
		extensions: [".ts"],
	},
	// Polyfill buffer
	plugins: [
		new webpack.ProvidePlugin({
			Buffer: ["buffer", "Buffer"],
		}),
	],
};

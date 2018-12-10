const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPligin = require("clean-webpack-plugin");
const baseConfig = require("./webpack.config.base");

baseConfig.mode = "production";
// baseConfig.entry = "./src/x-http.js";
baseConfig.entry = "./src/index.js";
baseConfig.output = {
    filename: "bundle.js",
    libraryTarget: "umd",
    library: "XHttp"
};
baseConfig.plugins.push(
	...[
		// 压缩代码 生产模式会默认调用该插件
		new UglifyJsPlugin({
			parallel: true,
			uglifyOptions: {
				compress: {
					drop_console: true, // 去除 console
					keep_infinity: true, // 去除部分影响性能代码，如：1/0
				},
				output: {
					comments: false, // 去除注释
					beautify: false // 紧凑输出
				}
			}
		}),
		new CleanWebpackPligin(path.resolve(__dirname, "../dist")) // 每次重新打包时清除原本的内容
	]
);

module.exports = baseConfig;

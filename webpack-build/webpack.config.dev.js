const webpack = require("webpack");
const baseConfig = require("./webpack.config.base");

baseConfig.mode = "development"; // 开发模式
baseConfig.entry = "./src/index.js";
baseConfig.output = {
    filename: "bundle.js"
};
baseConfig.devtool = "source-map";
baseConfig.devServer = {
    contentBase: "./", // 发布服务的文件夹~默认为运行npm命令时的当前文件夹
    host: "127.0.0.1",
    port: 8066,
    hot: true, // 声明为热替换
    open: true, // 第一次打包时打开浏览器
};
baseConfig.plugins.push(
    ...[
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(), // 热替换插件
    ]
);
module.exports = baseConfig;
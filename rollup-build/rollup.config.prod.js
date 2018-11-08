import nodeResolve from "rollup-plugin-node-resolve" // 帮助寻找node_modules里的包
import babel from "rollup-plugin-babel" // rollup 的 babel 插件，ES6转ES5
import replace from "rollup-plugin-replace" // 替换待打包文件里的一些变量，如 process在浏览器端是不存在的，需要被替换
import commonjs from "rollup-plugin-commonjs" // 将非ES6语法的包转为ES6可用
import { terser } from 'rollup-plugin-terser'

const env = process.env.NODE_ENV

const config = {
	input: "./src/index.js",
	output: {
		file: 'bundle.js',
		format: "umd", // 输出 ＵＭＤ格式，各种模块规范通用
		name: 'XHttp', // 打包后的全局变量，如浏览器端 window.ReactRedux
	},
	plugins: [
		nodeResolve(),
		commonjs(),
		replace({
			"process.env.NODE_ENV": JSON.stringify(env)
		}),
		babel({
			exclude: "**/node_modules/**"
		}),
		terser()
	]
}

export default config
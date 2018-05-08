
// 一个常见的`webpack`配置文件
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;//提取公共库，jquery、bootstrap等


var glob = require('glob');
var path = require('path');
//entries函数，用于遍历js文件分别打包
var entries=function(){
	var jsDir = path.resolve(__dirname,'webpack');
	//var entryFiles = glob.sync(jsDir + '/*.{js,jsx}');
	var entryFiles = glob.sync(jsDir + '/home.{js,jsx}');
	var map = {};
	for(var i=0;i < entryFiles.length;i++){
		var filePath = entryFiles[i];
		var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
		map[filename] = filePath;
	}
	return map;
}


module.exports = {
    entry:  __dirname + "/webpack/home.js",
    output: {
		path: __dirname + "/static/js/postSystem",
        filename: "home.js"
    },
	devtool:'source-map',//打包同时生成源文件，调试使 用
	module:{
		rules:[
			{
				test:/(\.jsx|\.js)$/,
				use:{
					loader:"babel-loader",
					options:{
						presets:[
							"es2015","react"
						]
					}
				},
				exclude:/node_modules/
			}
		]
	}
	/*plugins: [
        new webpack.BannerPlugin('版权归lx所有'),
		new CommonsChunkPlugin({    //打包引入的第三方插件
			name: 'library',
			minChunks: Infinity
		})
    ]*/
};
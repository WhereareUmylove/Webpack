
const path = require('path');
const webpack = require('webpack')
//happypack多核编译
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const HtmlWebpackPlugin = require('html-webpack-plugin')
//1.引入VueLoaderPlugin插件(在vue-loader15版本以后需要配置这个)
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    mode: "development",
    //入口文件的配置
    entry: path.resolve(__dirname, 'src/main.js'),
    //文件输出路径
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    /*devServer: {
        // 这是配置 dev-server 命令参数的第二种形式，相对来说，这种方式麻烦一些
        //  --open --port 3000 --contentBase src --hot
        open: true, // 自动打开浏览器
        port: 3000, // 设置启动时候的运行端口
        contentBase: 'src', // 指定托管的根目录
        hot: true // 启用热更新 的 第1步
    },*/
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            //我要编译哪个html文件到内存
            template: path.resolve(__dirname, 'src/index.html'),//模板路径
            //内存中的html文件叫什么名字
            filename: 'index.html'
        }),
        new VueLoaderPlugin(),
        new HappyPack({
            //用id来标识 happypack处理那里类文件
            id: 'happyBabel',
            //如何处理  用法和loader 的配置一样
            loaders: [{
                loader: 'babel-loader?cacheDirectory=true',
            }],
            //共享进程池
            threadPool: happyThreadPool,
            //允许 HappyPack 输出日志
            verbose: true,
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(png|jpg|gif|bmp|jpeg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            //当图片小于8kb的时候，使用base64编码图片
                            limit: 8192,
                            //配置打包后的图片的名字
                            name: '[hash:8]-[name].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(ttf|eot|svg|woff|woff2)$/,
                use: [
                    {
                        loader: 'url-loader'
                    }
                ]
            }, // 处理 字体文件的 loader
            //配置 babel 的 loader规则的时候，必须 把 node_modules 目录，通过 exclude 选项排除掉
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                use: 'vue-loader',
            },
            {
                test: /\.js$/,
                //把对.js 的文件处理交给id为happyBabel 的HappyPack 的实例执行
                loader: 'happypack/loader?id=happyBabel',
                //排除node_modules 目录下的文件
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        //别名
        alias: {
            "vue$": "vue/dist/vue.js"
        }
    }
}
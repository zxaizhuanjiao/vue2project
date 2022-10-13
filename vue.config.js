module.exports = {
    outputDir: 'dist',   //build输出目录
    assetsDir: 'assets', //静态资源目录（js, css, img）
    lintOnSave: false, //是否开启eslint
    devServer: {
        host: "0.0.0.0",
        port: process.env.port,
        https: false,
        hotOnly: false,
        proxy: {
            [process.env.VUE_APP_API]: {
				target: `${process.env.VUE_APP_PATH}:${process.env.VUE_APP_PORT}/`, // 代理到 目标路径
                ws: true,
                changeOrigin: true,
                pathRewrite: {
					['^' + process.env.VUE_APP_API]: ''
                }
            }
        },
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    },
    runtimeCompiler: true,
    chainWebpack: config => {
        const oneOfsMap = config.module.rule('scss').oneOfs.store
        oneOfsMap.forEach(item => {
            item
                .use('sass-resources-loader')
                .loader('sass-resources-loader')
                .options({
                    // Provide path to the file with resources
                    resources: 'src/style/reset.scss',//文件的路径

                    // Or array of paths
                    // resources: ['./path/to/vars.scss', './path/to/mixins.scss']
                })
                .end()
        })
    }
};



module.exports = {
    publicPath: "./",
    outputDir: "dist",
    assetsDir: "assets",
    indexPath: "index.html",
    filenameHashing: true,
    pages: undefined,
    lintOnSave: true,
    runtimeCompiler: false,
    transpileDependencies: [],
    productionSourceMap: true,
    configureWebpack: config => {
        config.output.devtoolModuleFilenameTemplate = info => {
            const resPath = info.resourcePath
            if ((/\.vue$/.test(resPath) && !/type=script/.test(info.identifier)) || /node_modules/.test(resPath)) {
                return `webpack:///${resPath}?${info.hash}`
            }
            return `webpack:///${resPath.replace('./src', 'my-code/src')}`
        }
        },
    crossorigin: undefined,
    integrity: false,
    devServer: {//代理
        disableHostCheck: false,
        host: "0.0.0.0",
        port: 8080,
        proxy: null
    },
    lintOnSave: false,
}
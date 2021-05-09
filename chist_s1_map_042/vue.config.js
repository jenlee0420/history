

const url ='chist_s2_map_042'
var webpackConfig ={
    publicPath: "./",
    outputDir: url,
    assetsDir: "assets",
    indexPath: "index.html",
    filenameHashing: true,
    pages: undefined,
    lintOnSave: true,
    runtimeCompiler: false,
    transpileDependencies: [],
    productionSourceMap: false,
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
module.exports = webpackConfig
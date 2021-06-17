module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/charmbo/'
        : '/',
    chainWebpack: config =>{
        config.module
            .rule()
            .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
            .use('url-loader')
            .loader('url-loader')
            .tap(opt => {
                    let options = opt || {}
                    options.limit = 10000
                return options
            })
    }
    // module: {
    //     rules:[
    //         {
    //             test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    //             loader: 'url-loader',
    //             options: {
    //                 limit: 10000,
    //             }
    //         },
    //     ]
    // }
}
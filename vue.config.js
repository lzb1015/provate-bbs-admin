const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack:{
    resolve:{
      alias:{
        '@':path.resolve(__dirname,'src')
      }
    },
    plugins:[
      AutoImport({
        resolvers:[ElementPlusResolver()]
      }),
      Components({
        resolvers:[ElementPlusResolver()]
      })
    ]
    
  },
  chainWebpack: (config) => {
    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      })
      return definitions
    })
  },
  devServer: {
      client: {
          overlay: false
      },
  }
})

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3306',   //node.js服务器运行的地址
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': 'http://192.168.0.102:8080'  //路径重写
        }
      },
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'views': '@/views',
      },
    }
  },
})

'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const express = require('express')
const app = express()
const router = express.Router()

const fileUpload = require('express-fileupload')
app.use(fileUpload())

app.use('/api', router)




const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true
    })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    before (app) {
      app.post('/api/uploadImg', (req, res) => {
        let uploadImg = req.files.uploadImg
        uploadImg.mv('public/images/' + req.files.uploadImg.name + '.jpg', function (err) {
          if (err) return res.status(500).send(err)
          res.send('File uploaded!')
        })
      })
    },
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [{
        from: /.*/,
        to: path.posix.join('/', 'index.html'),
      }],
    },
    // https: true,
    hot: true,
    contentBase: false,
    compress: true,
    host: 'localhost',
    port: PORT || 3000,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    publicPath: '/',
    proxy: {
      // '/etcloud': 'http://192.168.51.13/', // 开发环境196
      // '/group1': 'http://192.168.51.24/',
      '/group1': 'http://192.168.51.196/',
      // '/etcloud': 'http://192.168.51.202/', //测试环境
      // '/etcloud': 'http://192.168.51.18/', // 开发环境
      '/etcloud': 'http://192.168.51.34/', // 开发环境
      // '/api': 'http://localhost:3000/'
    },
    quiet: true,
    watchOptions: {
      poll: true
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      host:`{
        etcloud: "/etcloud/etcloud-sys/",
        etcloudIvatAppZuul: "/etcloud/zuul/etcloud-ivat/",
        etcloudIvatApp: "/etcloud/etcloud-ivat/",
        album: "http://127.0.0.1:3000/",
      }`,
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../static'),
      to: config.dev.assetsSubDirectory,
      ignore: ['.*']
    }])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors ?
          utils.createNotifierCallback() :
          undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})

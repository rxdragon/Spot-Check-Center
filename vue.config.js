/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
const path = require('path')
const pkg = require('./package.json')

const { dependencies, devDependencies, name, version } = pkg
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: +Date.now(),
}

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  filenameHashing: true, // 是否使用md5码
  lintOnSave: true, // eslint 错误处理，true表示对待eslint错误为warnings，warnings不会导致编译失败
  productionSourceMap: true, // 生产环境是否开启source map
  integrity: false, // 内容安全策略及子资源完整性
  pages: {
    index: {
      entry: 'src/render/main.ts',
      template: 'public/index.html',
      filename: 'index.html',
      title: '质量检测系统',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },
  configureWebpack: (c) => {
    const config = {
      resolve: {
        alias: {
          "~": resolve('src/'),
          '@': resolve('src/render/'),
          '@assetsDir': resolve('src/render/assets/'),
          '@SelectBox': resolve('src/render/components/SelectBox'),
          '@AssessmentComponents': resolve('src/render/components/AssessmentComponents'),
          '@electronMain': resolve('src/main')
        }
      },
      externals: {
        'electron': 'require("electron")',
        'fs': 'require("fs")',
        'original-fs': 'require("original-fs")'
      }
    }
    return config
  },
  transpileDependencies: ['single-spa','qiankun','import-html-entry'],
  chainWebpack: config => {
    if (config.plugins.has('progress') && process.env.CI_RUNNER_ID) {
      config.plugins.delete('progress')
    }
    config.plugin('define')
      .tap(args => {
        args[0].__APP_INFO__ = JSON.stringify(__APP_INFO__)
        return args
      })
  },
  css: {
  },
  pluginOptions: {
    electronBuilder: {
      preload: 'src/main/preload.ts',
      mainProcessFile: 'src/main/background.ts', // 主进程入口
      builderOptions: {
        appId: 'com.example.app',
        productName: '缦图云端',
        copyright: 'Copyright © 2021'
      }
    },
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        resolve('src/render/assets/styles/variables.module.less')
      ]
    }
  }
}

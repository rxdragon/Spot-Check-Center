const path = require('path')

module.exports = {
  entry: [
    './src/main/background-main.ts'
  ],
  target: 'node',
  devtool: 'source-map',
  output: {
    filename: 'background-main.js',
    path: path.join(__dirname, '../dist_vue')
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
        exclude: /node_modules/,
      }
    ]
  },
  externals: {
    'electron': 'require("electron")',
    'original-fs': 'require("original-fs")'
  }
}

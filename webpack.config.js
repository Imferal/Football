const path = require('path'); // Встроенный модуль NodeJS для путей к файлам проекта
const HtmlWebpackPlugin = require('html-webpack-plugin'); // Модуль для работы с HTML (обновление сервера при изменении .html)
const webpack = require('webpack');

module.exports = {
  devServer: {
    open: true
  },
  devtool: 'source-map',
  entry: './src/index.js', // Файл входа
  output: {
    path: path.join(__dirname, 'build/'), // dirname - путь к директории относительно файла, откуда идёт вызов
    filename: 'bundle.js', // Куда собираем
    publicPath: '/build/' // Папка для стилей, картинок и т.п.
  },
  module: {
    rules: [{
        test: /\.js/, // Расширение файла в виде регулярного выражения
        use: [ // Принимает лоадеры модулей в виде объектов
          // uglify сюда
          {
            loader: 'babel-loader',
            options: { // Настройки конкретного лоадера
              presets: [
                "@babel/preset-env",
                "@babel/preset-react"
              ],
              plugins: [
                [
                  "@babel/plugin-proposal-class-properties"
                ]
              ]
            }
          }

        ]
      },
      { // Sass компилятор
        test: /\.s[ac]ss$/,
        exclude: [
          path.resolve(__dirname, 'library.blocks'),
          path.resolve(__dirname, 'common.blocks')
        ],
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
  ]
}
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
    mode: 'production', // LE INDICO EL MODO EXPLICITAMENTE
    entry: './src/index.js', // el punto de entrada de mi aplicación
    output: { // Esta es la salida de mi bundle
        path: path.resolve(__dirname, 'dist'),
        // resolve lo que hace es darnos la ruta absoluta de el S.O hasta nuestro archivo
        // para no tener conflictos entre Linux, Windows, etc
        filename: '[name].[contenthash].js',
        // EL NOMBRE DEL ARCHIVO FINAL,
        assetModuleFilename: 'assets/image/[hash][ext][query]'
    },
    resolve: {
        extensions: ['.js'], // Extensiones con las que vamos a trabajar
        alias: {
          // Aqui le damores un alias a las rutas de nuestro proyecto
          '@utils': path.resolve(__dirname, './src/utils/'),
          '@templates': path.resolve(__dirname, './src/templates/'),
          '@styles': path.resolve(__dirname, './src/styles/'),
          '@images': path.resolve(__dirname, './src/assets/images/'),
        },
      },
    module: {
        // REGLAS PARA TRABAJAR CON WEBPACK
        rules : [
            {
                test: /\.m?js$/, // LEE LOS ARCHIVOS CON EXTENSION .JS,
                exclude: /node_modules/, // IGNORA LOS MODULOS DE LA CARPETA
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css|.scss|.styl$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                    'stylus-loader',
                ]
            },
            {
                test: /\.png/,
                type: "asset/resource"
            },
            {
                test: /\.(woff|woff2)$/,
                use: {
                  loader: "url-loader",
                  options: {
                    // limit => limite de tamaño
                    limit: 10000,
                    // Mimetype => tipo de dato
                    mimetype:"application/font-woff",
                    name: "[name].[contenthash].[ext]",
                    // outputPath => donde se va a guardar en la carpeta final
                    outputPath: "./assets/fonts/",
                    publicPath: "./assets/fonts/",
                    esModule:false,
                  }
                }
            }
        ]
    },
    // SECCION DE PLUGINS
    plugins: [
        new HtmlWebpackPlugin({ // CONFIGURACIÓN DEL PLUGIN
            inject:true, // INYECTA EL BUNDLE AL TEMPLATE HTML
            template: './public/index.html', // LA RUTA AL TEMPLATE HTML
            filename: './index.html' // NOMBRE FINAL DEL ARCHIVO
        }),
        new MiniCssExtractPlugin(
            {
                filename: 'assets/[name].[contenthash].css'
            }
        ),
        new CopyPlugin({
            patterns: [
              {
                from: path.resolve(__dirname, "src", "assets/images"),
                to: "assets/images"
              }
            ]
        }),
        new Dotenv()
    ],
    optimization: {
        minimize:true,
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin()
        ]
      }
}
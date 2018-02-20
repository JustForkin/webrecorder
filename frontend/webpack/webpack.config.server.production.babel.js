import autoprefixer from 'autoprefixer';
import merge from 'webpack-merge';
import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CleanPlugin from 'clean-webpack-plugin';
import StripLoader from 'strip-loader';
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';

import baseConfiguration from './webpack.config.server';


const projectRootPath = path.resolve(__dirname, '../');
const assetsPath = path.resolve(projectRootPath, './static/dist');

const config = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        use: [
          StripLoader.loader('debug'),
          'babel-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  autoprefixer({
                    browsers: [
                      '>1%',
                      'last 4 versions',
                      'Firefox ESR',
                      'not ie < 9',
                    ]
                  })
                ];
              }
            }
          },
          'sass-loader',
        ]
      }
    ]
  },

  plugins: [
    //new CleanPlugin([assetsPath], { root: projectRootPath }),

    // css files from the extract-text-plugin loader
    // new ExtractTextPlugin({
    //   filename: '[name]-[chunkhash].css',
    //   allChunks: true
    // }),

    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: false,
      __DEVTOOLS__: false,
      __PLAYER__: false
    }),

    new HardSourceWebpackPlugin(),

    // optimizations
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        warnings: true,
        dead_code: true,
        drop_console: true
      }
    })
  ]
};

export default merge(baseConfiguration, config);


// const projectRootPath = path.resolve(__dirname, '../');
// const assetsPath = path.resolve(projectRootPath, './static/dist');

// const config = {
//   module: {
//     rules: [
//       {
//         test: /\.(js|jsx)?$/,
//         exclude: /node_modules/,
//         use: [
//           StripLoader.loader('debug'),
//           'babel-loader'
//         ]
//       },
//       {
//         test: /\.scss$/,
//         use: ExtractTextPlugin.extract({
//           fallback: 'style-loader',
//           use: [
//             'css-loader',
//             {
//               loader: 'postcss-loader',
//               options: {
//                 plugins: function () {
//                   return [
//                     autoprefixer({
//                       browsers: [
//                         '>1%',
//                         'last 4 versions',
//                         'Firefox ESR',
//                         'not ie < 9',
//                       ]
//                     })
//                   ];
//                 }
//               }
//             },
//             'sass-loader',
//           ]
//         })
//       }
//     ]
//   },
//   plugins: [
//     new CleanPlugin([assetsPath], { root: projectRootPath }),

//     // css files from the extract-text-plugin loader
//     new ExtractTextPlugin({
//       filename: '[name]-[chunkhash].css',
//       allChunks: true
//     }),

//     new webpack.DefinePlugin({
//       __CLIENT__: false,
//       __SERVER__: true,
//       __DEVELOPMENT__: false,
//       __DEVTOOLS__: false,
//       __PLAYER__: false
//     }),

//     new HardSourceWebpackPlugin(),

//     // optimizations
//     new webpack.optimize.UglifyJsPlugin({
//       compress: {
//         unused: true,
//         warnings: true,
//         dead_code: true,
//         drop_console: true
//       }
//     })
//   ]
// };

// export default merge(baseConfiguration, config);
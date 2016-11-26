
  // webpack.config.js
  module.exports = {
      entry: "./src/chromota-core/chromata.js",
      output: {
          path: __dirname,
          filename: "./lib/chromata-core-bundle.js"
      },
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            query: {
              presets: ['es2015']
            }
          }
        ]
      }
  };

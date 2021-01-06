const path = require('path');

module.exports = {
  
  // Set the working folder
  context: path.resolve(__dirname, '../src'),

  // Support Internet Explorer 11 by building to ES5
  target: ['web', 'es5'],

  entry: {
    // Pull in all dependencies starting from the root file, using corejs polyfills
    app: ['./plumbing/polyfill.ts', './app/app.ts']
  },
  module: {
    rules: [
      {
        // Files with a .ts extension are loaded by the Typescript loader
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    
    // Set extensions for import statements, and the .js extension allows us to import modules from JS libraries
    extensions: ['.ts', '.js']
  },
  output: {
    
    // Output bundles to a dist folder
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].bundle.js'
  },
  optimization: {

    // Indicate that third party code is built to a separate vendor bundle file
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          name: 'vendor',
          test: /node_modules/,
          enforce: true
        },
      }
    }
  }
}

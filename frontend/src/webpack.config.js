const path = require('path');

module.exports = {
  entry: './src/index.js', // adjust your entry file as needed
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'cheap-module-source-map', // or any other suitable devtool option
};
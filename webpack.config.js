const path = require('path');
// const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'axios-nest.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'AxiosNest',
    libraryTarget: 'umd', // 使用 Universal Module Definition 格式
    globalObject: 'this',   // 解决在 Node 环境下 global 对象的问题
    libraryExport: 'default',      // 将默认导出对象直接暴露，而不包裹在 default 中
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  externals: {
    axios: 'axios' // 排除 axios
  },
  devtool: 'source-map',
  mode: 'development',
  // mode: 'production',
  devServer: {
    static: [
      {
        directory: path.join(__dirname, 'dist'),
        publicPath: '/dist',
      },
      {
        directory: path.join(__dirname, 'demo'),
        publicPath: '/',
      }
    ],
    hot: true,
    // open: true,
    port: 3000
  },
  plugins: [
    // new CopyPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve(__dirname, 'src/**/*.d.ts'),
    //       to: path.resolve(__dirname, 'dist'),
    //     }
    //   ]
    // })
  ]
};

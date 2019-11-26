/* eslint @typescript-eslint/no-var-requires: 0 */
const dotenv = require('dotenv');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');

dotenv.config();
const CWD = process.cwd();
const IS_DEV = process.env.NODE_ENV === 'development';

const PACKAGE_JSON = path.resolve(CWD, 'package.json');

const { name, peerDependencies } = require(PACKAGE_JSON);

module.exports = function configureWebpack({ css, typescript, sass }) {
  const config = {
    devtool: IS_DEV ? 'inline-source-map' : undefined,
    entry: [],
    externals: [],
    mode: IS_DEV ? 'development' : 'production',
    module: {
      rules: [
        // Images
        {
          loader: 'url-loader',
          options: {
            limit: 10240,
            name: 'static/media/[name].[hash:8].[ext]',
          },
          test: [/\.(?:gif|jpg|png)$/],
        },
      ],
    },
    output: {
      filename: './index.js',
      library: name,
      libraryTarget: 'umd',
      path: path.resolve(CWD, 'dist'),
      umdNamedDefine: true,
    },
    performance: {
      maxAssetSize: IS_DEV ? 1024000 : 250000,
      maxEntrypointSize: IS_DEV ? 1024000 : 250000,
    },
    plugins: [],
    resolve: {
      alias: {},
      extensions: ['.js', '.jsx'],
    },
  };

  // TypeScript files
  if (typescript) {
    config.entry.push('./src/index.ts');

    // .ts, .tsx
    config.module.rules.push({
      loader: 'ts-loader',
      test: [/\.tsx?$/],
    });
    config.resolve.extensions.push('.ts');
    config.resolve.extensions.push('.tsx');
  }

  // CSS files
  if (css | sass) {
    const use = [
      {
        loader: 'style-loader',
        options: { singleton: true },
      },
      {
        loader: 'css-loader',
        options: { modules: false },
      },
    ];
    if (sass) {
      config.plugins.push(new OptimizeCssAssetsPlugin({}));
      use.push({ loader: 'sass-loader' });
    }

    // .css, .scss
    config.module.rules.push({
      test: sass ? [/\.s?css$/] : [/\.css$/],
      use,
    });
  }

  if (peerDependencies) {
    for (const peerDependency of Object.keys(peerDependencies)) {
      config.externals.push(peerDependency);
      config.externals.push(new RegExp(`^${peerDependency}/.+$`));
      config.resolve.alias[peerDependency] = path.resolve(
        CWD,
        `./node_modules/${peerDependency}`,
      );
    }
  }
  return config;
};

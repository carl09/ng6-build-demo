import { getSystemPath, normalize, Path, resolve } from '@angular-devkit/core';
import {
  AngularCompilerPlugin,
  AngularCompilerPluginOptions,
  PLATFORM,
} from '@ngtools/webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import { IBuildConfig } from 'model';
import * as UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import { Configuration } from 'webpack';

export function commonConfig(root: Path, options: IBuildConfig): Configuration {
  const tsConfigPath = getSystemPath(
    normalize(resolve(root, normalize(options.tsConfig))),
  );

  const pluginOptions: AngularCompilerPluginOptions = {
    mainPath: undefined, // path.join(getSystemPath(root), builderConfig.options.main),
    entryModule: 'projects/webworker/src/app/app.module#AppModule',
    platform: PLATFORM.Browser,
    sourceMap: false,
    tsConfigPath,
  };

  const commonWebpackConfig: Configuration = {
    mode: options.prod ? 'production' : 'development',
    devtool: options.prod ? 'none' : 'source-map',
    entry: {
      webworker: getSystemPath(
        normalize(resolve(root, normalize(options.main))),
      ),
    },
    target: 'node',
    resolve: {
      extensions: ['.ts', '.js'],
      modules: [root, 'node_modules'],
    },
    // context: root,
    // Make sure we include all node_modules etc
    externals: [/node_modules/],
    output: {
      // Puts the output at the root of the dist folder
      path: getSystemPath(
        normalize(resolve(root, normalize(options.outputPath))),
      ),
      filename: '[name].js',
    },
    plugins: [
      new AngularCompilerPlugin(pluginOptions),
      new HtmlWebpackPlugin({
        template: getSystemPath(
          normalize(resolve(root, normalize(options.index))),
        ),
        filename: './index.html',
        hash: false,
        inject: true,
        compile: true,
        // 'favicon': false,
        minify: false,
        cache: true,
        showErrors: true,
        // 'chunks': 'all',
        excludeChunks: ['webworker'],
        title: 'Webpack App',
        xhtml: true,
      }),
    ],
    module: {
      rules: [
        // { test: /\.ts$/, loader: 'ts-loader' },
        { test: /\.ts$/, loader: '@ngtools/webpack' },
        {
          // Mark files inside `@angular/core` as using SystemJS style dynamic imports.
          // Removing this will cause deprecation warnings to appear.
          test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
          parser: { system: true },
        },
      ],
    },
    optimization: {
      noEmitOnErrors: true,
      minimizer: [
        new UglifyJSPlugin({
          sourceMap: !options.prod,
          parallel: true,
          cache: true,
          uglifyOptions: {
            // ecma: wco.supportES2015 ? 6 : 5,
            // warnings: !!buildOptions.verbose,
            mangle: options.prod,
            safari10: true,
            output: {
              beautify: true,
              ascii_only: true,
              comments: false,
              webkit: true,
            },
            compress: {
              passes: 3,
            },
          },
        }),
      ],
    },
  };

  return commonWebpackConfig;
}

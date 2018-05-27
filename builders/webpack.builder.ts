// tslint:disable:no-implicit-dependencies
import {
  getSystemPath,
  normalize,
  Path,
  resolve,
  virtualFs,
} from '@angular-devkit/core';
import {
  AngularCompilerPlugin,
  AngularCompilerPluginOptions,
  PLATFORM,
} from '@ngtools/webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as path from 'path';
import * as UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import { Configuration } from 'webpack';

export function commonConfig(root: Path, options: any): Configuration {
  const tsConfigPath = getSystemPath(
    normalize(resolve(root, normalize(options.tsConfig))),
  );

  // i18nInFile: undefined,
  // i18nInFormat: undefined,
  // locale: undefined,
  // platform: 0,
  // missingTranslation: undefined,
  // sourceMap: true,
  // additionalLazyModules: {},
  // nameLazyFiles: true,
  // forkTypeChecker: true,
  // tsConfigPath: 'C:\\dev\\ngx6\\src\\tsconfig.app.json',
  // skipCodeGeneration: true,
  // compilerOptions: {},
  // host: AliasHost { _delegate: NodeJsSyncHost {}, _aliases: Map {} } }

  const pluginOptions: AngularCompilerPluginOptions = {
    mainPath: undefined, // path.join(getSystemPath(root), builderConfig.options.main),
    entryModule: 'projects/webworker/src/app/app.module#AppModule',
    platform: PLATFORM.Browser,
    sourceMap: false,
    tsConfigPath,
  };

  const commonWebpackConfig: Configuration = {
    mode: 'development', // 'production', // : 'development',
    // mode: 'production',
    devtool: 'source-map',
    // devtool: false,
    entry: {
      // This is our Express server for Dynamic universal
      // server: getSystemPath(root, builderConfig.options.main),
      webworker: getSystemPath(
        normalize(resolve(root, normalize(options.main))),
      ),
    },
    target: 'node', // 'webworker', //
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
          sourceMap: false,
          parallel: true,
          cache: true,
          uglifyOptions: {
            // ecma: wco.supportES2015 ? 6 : 5,
            // warnings: !!buildOptions.verbose,
            mangle: false,
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

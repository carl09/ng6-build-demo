// tslint:disable:no-implicit-dependencies
import {
  Builder,
  BuilderConfiguration,
  BuilderContext,
  BuildEvent,
} from '@angular-devkit/architect';
import {
  getSystemPath,
  normalize,
  Path,
  resolve,
  tags,
  terminal,
  virtualFs,
} from '@angular-devkit/core';
import {
  AngularCompilerPlugin,
  AngularCompilerPluginOptions,
  PLATFORM,
} from '@ngtools/webpack';
import * as path from 'path';
import { concat, Observable, of } from 'rxjs';
import * as webpack from 'webpack';
import * as webpackMerge from 'webpack-merge';
import * as webpackBuild from './webpack.builder';

const { bold, green, red, reset, white, yellow } = terminal;
// import { getNonAotConfig } from '@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/index';

console.log('fun');

export class ServerBuilder implements Builder<any> {
  constructor(public context: BuilderContext) {}

  run(builderConfig: BuilderConfiguration<any>): Observable<BuildEvent> {
    const root = this.context.workspace.root;
    const projectRoot = resolve(root, builderConfig.root);

    const tsConfigPath = getSystemPath(
      normalize(resolve(root, normalize(builderConfig.options.tsConfig))),
    );

    console.log('run', builderConfig, root, projectRoot);

    const pluginOptions: AngularCompilerPluginOptions = {
      mainPath: undefined, // path.join(getSystemPath(root), builderConfig.options.main),
      platform: PLATFORM.Server,
      sourceMap: false,
      tsConfigPath,
    };

    console.log('pluginOptions', pluginOptions);

    const commonWebpackConfig = webpackBuild.commonConfig(
      root,
      builderConfig.options,
    );

    const webpackCompiler = webpack(commonWebpackConfig);

    const statsConfig = getWebpackStatsConfig(true);

    return new Observable(obs => {
      const callback: webpack.compiler.CompilerCallback = (err, stats) => {
        if (err) {
          return obs.error(err);
        }

        const json = stats.toJson(statsConfig);
        this.context.logger.info(stats.toString(statsConfig));

        if (stats.hasWarnings()) {
          this.context.logger.warn(statsWarningsToString(json, statsConfig));
        }
        if (stats.hasErrors()) {
          this.context.logger.error(statsErrorsToString(json, statsConfig));
        }

        obs.next({ success: true });

        obs.complete();
      };

      webpackCompiler.run(callback);

      // webpackCompiler.run(e => {
      //   console.log('help', e);

      //   obs.next({ success: true });
      //   obs.complete();
      // });
    });
  }
}

const webpackOutputOptions = {
  colors: true,
  hash: true, // required by custom stat output
  timings: true, // required by custom stat output
  chunks: true, // required by custom stat output
  chunkModules: false,
  children: false, // listing all children is very noisy in AOT and hides warnings/errors
  modules: false,
  reasons: false,
  warnings: true,
  errors: true,
  assets: true, // required by custom stat output
  version: false,
  errorDetails: false,
  moduleTrace: false,
};

const verboseWebpackOutputOptions = {
  children: true,
  assets: true,
  version: true,
  reasons: true,
  chunkModules: false, // TODO: set to true when console to file output is fixed
  errorDetails: true,
  moduleTrace: true,
};

function getWebpackStatsConfig(verbose = false) {
  return verbose
    ? { ...webpackOutputOptions, ...verboseWebpackOutputOptions }
    : webpackOutputOptions;
}

function statsWarningsToString(json: any, statsConfig: any) {
  const colors = statsConfig.colors;
  const rs = (x: string) => (colors ? reset(x) : x);
  const y = (x: string) => (colors ? bold(yellow(x)) : x);

  return rs(
    '\n' +
      json.warnings
        .map((warning: any) => y(`WARNING in ${warning}`))
        .join('\n\n'),
  );
}

function statsErrorsToString(json: any, statsConfig: any) {
  const colors = statsConfig.colors;
  const rs = (x: string) => (colors ? reset(x) : x);
  const r = (x: string) => (colors ? bold(red(x)) : x);

  return rs(
    '\n' + json.errors.map((error: any) => r(`ERROR in ${error}`)).join('\n'),
  );
}

export default ServerBuilder;

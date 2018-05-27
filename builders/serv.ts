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
import * as UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import * as webpack from 'webpack';
import * as WebpackDevServer from 'webpack-dev-server';
import * as webpackMerge from 'webpack-merge';
import * as webpackBuild from './webpack.builder';

const { bold, green, red, reset, white, yellow } = terminal;

export class ServerBuilder implements Builder<any> {
  constructor(public context: BuilderContext) {}

  run(builderConfig: BuilderConfiguration<any>): Observable<BuildEvent> {
    const root = this.context.workspace.root;
    const projectRoot = resolve(root, builderConfig.root);

    const tsConfigPath = getSystemPath(
      normalize(resolve(root, normalize(builderConfig.options.tsConfig))),
    );

    console.log('run', builderConfig, root, projectRoot);

    const webpackConfig = webpackBuild.commonConfig(
      root,
      builderConfig.options,
    );

    console.log('commonWebpackConfig', webpackConfig);

    // const webpackCompiler = webpack(commonWebpackConfig);

    const config: WebpackDevServer.Configuration = {
      port: 7070,
      host: 'localhost',
      // watchOptions: {
      //   poll: true,
      // },
    };

    return new Observable(obs => {
      const webpackCompiler = webpack(webpackConfig);
      const server = new WebpackDevServer(webpackCompiler, config);

      const statsConfig = getWebpackStatsConfig(true);

      // tslint:disable-next-line:no-any
      (webpackCompiler as any).hooks.done.tap(
        'angular-cli',
        (stats: webpack.Stats) => {
          // if (!browserOptions.verbose) {
          const json = stats.toJson(statsConfig);
          this.context.logger.info(statsToString(json, statsConfig));
          if (stats.hasWarnings()) {
            this.context.logger.info(statsWarningsToString(json, statsConfig));
          }
          if (stats.hasErrors()) {
            this.context.logger.info(statsErrorsToString(json, statsConfig));
          }
          // }
          obs.next({ success: !stats.hasErrors() });

          // if (first ) {
          //   first = false;
          //   opn(serverAddress + webpackDevServerConfig.publicPath);
          // }
        },
      );

      const httpServer = server.listen(7070, 'localhost', (err: any) => {
        // tslint:disable-line:no-any
        if (err) {
          obs.error(err);
        }
      });

      //     // Node 8 has a keepAliveTimeout bug which doesn't respect active connections.
      //     // Connections will end after ~5 seconds (arbitrary), often not letting the full download
      //     // of large pieces of content, such as a vendor javascript file.  This results in browsers
      //     // throwing a "net::ERR_CONTENT_LENGTH_MISMATCH" error.
      //     // https://github.com/angular/angular-cli/issues/7197
      //     // https://github.com/nodejs/node/issues/13391
      //     // https://github.com/nodejs/node/commit/2cb6f2b281eb96a7abe16d58af6ebc9ce23d2e96
      if (/^v8.\d.\d+$/.test(process.version)) {
        httpServer.keepAliveTimeout = 30000; // 30 seconds
      }

      // Teardown logic. Close the server when unsubscribed from.

      console.log('Teardown logic');
      return () => server.close();
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
    ? Object.assign(webpackOutputOptions, verboseWebpackOutputOptions)
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

export function statsToString(json: any, statsConfig: any) {
  const colors = statsConfig.colors;
  const rs = (x: string) => (colors ? reset(x) : x);
  const w = (x: string) => (colors ? bold(white(x)) : x);
  const g = (x: string) => (colors ? bold(green(x)) : x);
  const y = (x: string) => (colors ? bold(yellow(x)) : x);

  const changedChunksStats = json.chunks
    .filter((chunk: any) => chunk.rendered)
    .map((chunk: any) => {
      const asset = json.assets.filter((x: any) => x.name == chunk.files[0])[0];
      const size = asset ? ` ${formatSize(asset.size)}` : '';
      const files = chunk.files.join(', ');
      const names = chunk.names ? ` (${chunk.names.join(', ')})` : '';
      const initial = y(
        chunk.entry ? '[entry]' : chunk.initial ? '[initial]' : '',
      );
      const flags = ['rendered', 'recorded']
        .map(f => (f && chunk[f] ? g(` [${f}]`) : ''))
        .join('');

      return `chunk {${y(chunk.id)}} ${g(
        files,
      )}${names}${size} ${initial}${flags}`;
    });

  const unchangedChunkNumber = json.chunks.length - changedChunksStats.length;

  if (unchangedChunkNumber > 0) {
    return (
      '\n' +
      rs(tags.stripIndents`
      Date: ${w(new Date().toISOString())} - Hash: ${w(json.hash)} - Time: ${w(
        '' + json.time,
      )}ms
      ${unchangedChunkNumber} unchanged chunks
      ${changedChunksStats.join('\n')}
      `)
    );
  } else {
    return (
      '\n' +
      rs(tags.stripIndents`
      Date: ${w(new Date().toISOString())}
      Hash: ${w(json.hash)}
      Time: ${w('' + json.time)}ms
      ${changedChunksStats.join('\n')}
      `)
    );
  }
}

export function formatSize(size: number): string {
  if (size <= 0) {
    return '0 bytes';
  }

  const abbreviations = ['bytes', 'kB', 'MB', 'GB'];
  const index = Math.floor(Math.log(size) / Math.log(1000));

  return `${+(size / Math.pow(1000, index)).toPrecision(3)} ${
    abbreviations[index]
  }`;
}

export default ServerBuilder;

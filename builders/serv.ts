// tslint:disable:no-implicit-dependencies
// tslint:disable:no-submodule-imports
import {
  Builder,
  BuilderConfiguration,
  BuilderContext,
  BuildEvent,
} from '@angular-devkit/architect';
import { getWebpackStatsConfig } from '@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs';
import {
  statsErrorsToString,
  statsToString,
  statsWarningsToString,
} from '@angular-devkit/build-angular/src/angular-cli-files/utilities/stats';
import { Observable } from 'rxjs';
import * as webpack from 'webpack';
import * as WebpackDevServer from 'webpack-dev-server';
import { IBuildConfig } from './model';
import * as webpackBuild from './webpack.builder';

export class ServerBuilder implements Builder<IBuildConfig> {
  constructor(public context: BuilderContext) {}

  run(
    builderConfig: BuilderConfiguration<IBuildConfig>,
  ): Observable<BuildEvent> {
    const root = this.context.workspace.root;

    const webpackConfig = webpackBuild.commonConfig(
      root,
      builderConfig.options,
    );

    // console.log('context', this.context);
    console.log('builderConfig', builderConfig);

    const config: WebpackDevServer.Configuration = {
      port: 7070,
      host: 'localhost',
    };

    return new Observable(obs => {
      const webpackCompiler = webpack(webpackConfig);
      const server = new WebpackDevServer(webpackCompiler, config);

      const statsConfig = getWebpackStatsConfig(true);

      (webpackCompiler as any).hooks.done.tap(
        'angular-cli',
        (stats: webpack.Stats) => {
          const json = stats.toJson(statsConfig);
          this.context.logger.info(statsToString(json, statsConfig));
          if (stats.hasWarnings()) {
            this.context.logger.info(statsWarningsToString(json, statsConfig));
          }
          if (stats.hasErrors()) {
            this.context.logger.info(statsErrorsToString(json, statsConfig));
          }
          obs.next({ success: !stats.hasErrors() });
        },
      );

      const httpServer = server.listen(7070, 'localhost', (err: any) => {
        if (err) {
          obs.error(err);
        }
      });

      if (/^v8.\d.\d+$/.test(process.version)) {
        httpServer.keepAliveTimeout = 30000; // 30 seconds
      }

      // Teardown logic. Close the server when unsubscribed from.

      console.log('Teardown logic');
      return () => server.close();
    });
  }
}

export default ServerBuilder;

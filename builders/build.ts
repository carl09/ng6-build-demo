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
  statsWarningsToString,
} from '@angular-devkit/build-angular/src/angular-cli-files/utilities/stats';
import { Observable } from 'rxjs';
import * as webpack from 'webpack';
import { IBuildConfig } from './model';
import * as webpackBuild from './webpack.builder';

export class BuildBuilder implements Builder<IBuildConfig> {
  constructor(public context: BuilderContext) {}

  run(
    builderConfig: BuilderConfiguration<IBuildConfig>,
  ): Observable<BuildEvent> {
    const root = this.context.workspace.root;

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
    });
  }
}

export default BuildBuilder;

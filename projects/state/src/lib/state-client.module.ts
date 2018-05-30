import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { WorkerSharedService } from './services/client/shared-worker.service';
import { WebWorkerService } from './services/client/web-worker.service';
import { WorkerService } from './services/client/worker.service';
import { StateProxyService } from './services/state-proxy.service';

@NgModule({
  imports: [],
  declarations: [],
  exports: [],
  providers: [],
})
export class StateClientModule {
  public static forRoot(isWebWorker: boolean): ModuleWithProviders {
    return {
      ngModule: StateClientModule,
      providers: [
        isWebWorker
          ? { provide: WorkerService, useClass: WebWorkerService }
          : { provide: WorkerService, useClass: WorkerSharedService },
        StateProxyService,
      ],
    };
  }
}

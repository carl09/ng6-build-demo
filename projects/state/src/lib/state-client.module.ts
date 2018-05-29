import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { StateProxyService } from './services/state-proxy.service';
import { WorkerClientService } from './services/worker-client.service';
import { WorkerSharedClientService } from './services/worker-shared-clients.service';

@NgModule({
  imports: [],
  declarations: [],
  exports: [],
  providers: [],
})
export class StateClientModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: StateClientModule,
      providers: [
        WorkerClientService,
        WorkerSharedClientService,
        StateProxyService,
      ],
    };
  }
}

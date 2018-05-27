import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { StateProxyService } from './services/state-proxy.service';
import { WorkerClientService } from './services/worker-client.service';

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
      providers: [WorkerClientService, StateProxyService],
    };
  }
}

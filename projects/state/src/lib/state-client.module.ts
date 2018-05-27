import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { StateProxyService } from './services/state-proxy.service';
import { WorkerClientService } from './services/worker-client.service';

@NgModule({
  imports: [],
  declarations: [],
  exports: [],
  providers: [],
})
export class StateLibModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: StateLibModule,
      providers: [WorkerClientService, StateProxyService],
    };
  }
}

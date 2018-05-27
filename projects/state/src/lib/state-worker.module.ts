import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { Action, ActionReducerMap, StoreModule } from '@ngrx/store';
import { IState, reducers } from './reducers/counter';
import { WorkerService } from './services/worker.service';

export const REDUCERS_TOKEN = new InjectionToken<ActionReducerMap<IState>>(
  'Registered Reducers',
);

@NgModule({
  imports: [StoreModule.forRoot(REDUCERS_TOKEN)],
  declarations: [],
  exports: [],
  providers: [{ provide: REDUCERS_TOKEN, useValue: reducers }],
})
export class StateWorkerModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: StateWorkerModule,
      providers: [WorkerService],
    };
  }
}

import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { Action, ActionReducerMap, StoreModule } from '@ngrx/store';
import { ProductsService } from './common/products.service';
import { IState, reducers } from './reducers/reducers';
import { BackGroundWorkerService } from './services/background-worker.service';
import { ActionProcessorService } from './services/worker/action-processor.service';
import { ProductsWorkerService } from './services/worker/products-worker.service';

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
      providers: [
        BackGroundWorkerService,
        ActionProcessorService,

        ProductsWorkerService,
        { provide: ProductsService, useExisting: ProductsWorkerService },
      ],
    };
  }
}

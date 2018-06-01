import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { Action, ActionReducerMap, StoreModule } from '@ngrx/store';
import { ProductsService } from './common/products.service';
import { SERVICE_WITH_INDEX } from './common/service-with-index.model';
import { IState, reducers } from './reducers/reducers';
import { BackGroundWorkerService } from './services/background-worker.service';
import { ProductsWorkerService } from './services/worker/products-worker.service';
import { UserWorkerService } from './services/worker/user-worker.service';

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
        ProductsWorkerService,
        {
          provide: SERVICE_WITH_INDEX,
          useExisting: ProductsWorkerService,
          multi: true,
        },
        {
          provide: SERVICE_WITH_INDEX,
          useClass: UserWorkerService,
          multi: true,
        },
      ],
    };
  }
}

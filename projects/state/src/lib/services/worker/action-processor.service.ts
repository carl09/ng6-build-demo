import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { IWorkerAction, IWorkerMessage } from '../../models';

@Injectable()
export class ActionProcessorService {
  constructor(private store: Store<any>) {
    // this.store.subscribe(x => {
    //   console.log('store', x);
    // });
  }

  public processMessage(
    data: IWorkerAction,
    action: (message: IWorkerMessage) => void,
  ) {
    if (data.action === 'reducer') {
      this.store.dispatch(data.payload);
    } else if (data.action === 'listen') {
      this.store.select(data.payload).subscribe(x => {
        action({
          reducer: data.payload,
          payload: x,
        });
      });
    }
  }
}

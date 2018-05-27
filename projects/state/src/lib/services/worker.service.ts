import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { IWorkerAction, IWorkerMessage } from './worker-client.service';

declare var postMessage: (v: any) => {};

@Injectable()
export class WorkerService {
  public listnerSubject: BehaviorSubject<IWorkerMessage> = new BehaviorSubject<
    IWorkerMessage
  >(undefined);

  private worker: Worker;

  constructor(private store: Store<any>) {
    this.store.subscribe(x => {
      console.log('store', x);
    });
  }

  public start() {
    onmessage = e => {
      console.log('Message received from main script', e);
      if (e.data) {
        const data: IWorkerAction = e.data;
        if (data.action === 'reducer') {
          this.store.dispatch(data.payload);
        } else if (data.action === 'listen') {
          this.store.select(data.payload).subscribe(x => {
            this.send({
              reducer: data.payload,
              payload: x,
            });
          });
        }
      }
    };
  }

  public listen(): Observable<IWorkerMessage> {
    return this.listnerSubject.asObservable();
  }

  public send(message: IWorkerMessage) {
    postMessage(message);
  }

  public stop() {
    // this.worker.removeEventListener('message');
    this.worker.terminate();
    this.worker = undefined;
  }
}

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { IWorkerAction, IWorkerMessage } from '../models';

declare const postMessage: (v: any) => {};
declare let onconnect: (e: any) => void;

// chrome://inspect/#workers

@Injectable()
export class WorkerService {
  private ports;

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
    console.log('start');

    if (typeof onmessage !== 'undefined' && typeof onmessage !== undefined) {
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
    } else {
      console.warn('Not a web Worker');
    }

    if (typeof onconnect !== 'undefined' && typeof onconnect !== undefined) {
      onconnect = c => {
        console.log(c);
        this.ports = c.ports[0];

        this.ports.onmessage = e => {
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
      };
    } else {
      console.warn('Not a shared Worker');
    }
  }

  public listen(): Observable<IWorkerMessage> {
    return this.listnerSubject.asObservable();
  }

  public send(message: IWorkerMessage) {
    if (this.ports) {
      this.ports.postMessage(message);
    } else {
      postMessage(message);
    }
  }

  public stop() {
    // this.worker.removeEventListener('message');
    this.worker.terminate();
    this.worker = undefined;
  }
}

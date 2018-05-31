import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ISubScriptionManager, IWorkerAction, IWorkerMessage } from '../models';
import { ActionProcessorService } from './worker/action-processor.service';
import { ProductsWorkerService } from './worker/products-worker.service';

declare const postMessage: (v: any) => {};
declare let onconnect: (e: any) => void;

// chrome://inspect/#workers

@Injectable()
export class BackGroundWorkerService {
  private listnerSubject: BehaviorSubject<IWorkerMessage>;
  private ports: any[] = [];
  private worker: Worker;
  private subs: ISubScriptionManager[] = [];

  constructor(
    // private actionProcessorService: ActionProcessorService,
    private productsService: ProductsWorkerService,
    private store: Store<any>,
  ) {
    this.listnerSubject = new BehaviorSubject<IWorkerMessage>(undefined);
  }

  public start() {
    console.log('start');

    if (typeof onmessage !== 'undefined' && typeof onmessage !== undefined) {
      onmessage = e => {
        if (e.data) {
          const data: IWorkerAction = e.data;
          this.processMessage(data, this.send);
        }
      };
    } else {
      console.warn('Not a web Worker');
    }

    if (typeof onconnect !== 'undefined' && typeof onconnect !== undefined) {
      onconnect = c => {
        console.log('portCont', c.ports.length);

        this.ports.push(c.ports[0]);
        c.ports[0].onmessage = e => {
          if (e.data) {
            const data: IWorkerAction = e.data;
            this.processMessage(data, this.send);
          }
        };
      };
    } else {
      console.warn('Not a shared Worker');
    }

    this.productsService.loadProducts();
  }

  public listen(): Observable<IWorkerMessage> {
    return this.listnerSubject.asObservable();
  }

  public send(message: IWorkerMessage) {
    if (this.ports && this.ports.length) {
      this.ports.forEach(p => p.postMessage(message));
    } else {
      postMessage(message);
    }
  }

  public stop() {
    this.worker.terminate();
    this.worker = undefined;
  }

  private processMessage(
    data: IWorkerAction,
    action: (message: IWorkerMessage) => void,
  ) {
    console.log('processMessage', data);

    const sub: ISubScriptionManager = {
      action: data.action,
      key: data.key,
    };

    if (data.action === 'reducer') {
      this.store.dispatch(data.payload);
    } else if (data.action === 'listen') {
      sub.subscription = this.store.select(data.payload).subscribe(x => {
        this.send({
          reducer: data.payload,
          payload: x,
        });
      });
    } else if (data.action === 'execute') {
      sub.subscription = this.productsService.methods[data.key](data.payload)
        // .pipe(take(1))
        .subscribe(x => {
          console.log('process executed:', x);
          this.send({
            reducer: data.key,
            payload: x,
          });
        });
    } else if (data.action === 'unsubscribe') {
    }

    if (sub.subscription) {
      this.subs.push(sub);
    }
  }
}

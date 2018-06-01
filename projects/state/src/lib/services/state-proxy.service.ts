import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  ExecuteWorkerAction,
  ListenWorkerAction,
  UnsubscribeWorkerAction,
} from '../models/worker-action.model';
import { WorkerService } from './client/worker.service';

@Injectable({
  providedIn: 'root',
})
export class StateProxyService {
  private subs: { [id: string]: BehaviorSubject<any> } = {};

  constructor(private workerService: WorkerService) {
    this.workerService.listen().subscribe(x => {
      console.log('StateProxyService', x);
      if (x !== undefined && this.subs[x.reducer] !== undefined) {
        Object.keys(this.subs).forEach(y => {
          const sub = this.subs[y];

          console.log('sub:', y, sub.observers.length);

          if (sub.observers.length === 1) {
            console.log('deleting sub', y);
            sub.complete();
            delete this.subs[y];
          }
        });
        this.subs[x.reducer].next(x.payload);
      }
    });
  }

  public select<K = any>(path: string): Observable<K> {
    const action = new ListenWorkerAction(path);
    const unsub = new UnsubscribeWorkerAction(action);

    if (this.subs[unsub.key] === undefined) {
      console.log('Crating Sub', path);
      this.subs[unsub.key] = new BehaviorSubject<K>(undefined);

      this.workerService.send(action);

      this.subs[unsub.key].subscribe(x => {}, null, () => {
        console.log('sending unsub:', unsub);
        this.workerService.send(unsub);
      });
    }

    return this.subs[unsub.key].asObservable();
  }

  public dispatch<V extends Action = Action>(action: V): void {
    this.workerService.send({
      action: 'reducer',
      payload: action,
    });
  }

  public execute<T>(
    method: string,
    uniqueRef: string,
    ...args: any[]
  ): Observable<T> {
    const action = new ExecuteWorkerAction(method, uniqueRef, args);
    const unsub = new UnsubscribeWorkerAction(action);

    if (this.subs[unsub.key] === undefined) {
      this.subs[unsub.key] = new BehaviorSubject<T>(undefined);

      this.workerService.send(action);

      this.subs[unsub.key].subscribe(x => {}, null, () => {
        console.log('sending unsub:', unsub);
        this.workerService.send(unsub);
      });
    }

    return this.subs[unsub.key].asObservable();
  }
}

function instrument<T>(source: Observable<T>) {
  return new Observable<T>(observer => {
    console.log('source: subscribing');
    const subscription = source
      // .do(value => console.log(`source: ${value}`))
      .subscribe(observer);
    return () => {
      subscription.unsubscribe();
      console.log('source: unsubscribed');
    };
  });
}

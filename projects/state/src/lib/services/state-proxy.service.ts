import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  ExecuteWorkerAction,
  ListenWorkerAction,
  UnsubscribeWorkerAction,
  WorkerActions,
} from '../models/worker-action.model';
import { WorkerService } from './client/worker.service';

@Injectable({
  providedIn: 'root',
})
export class StateProxyService {
  private subs: { [id: string]: BehaviorSubject<any> } = {};

  constructor(private workerService: WorkerService) {
    this.workerService.listen().subscribe(x => {
      if (x !== undefined && this.subs[x.reducer] !== undefined) {
        Object.keys(this.subs).forEach(y => {
          const sub = this.subs[y];

          if (sub.observers.length === 1) {
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

    return this.createInnerSub(action, unsub);
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

    return this.createInnerSub(action, unsub);
  }

  private createInnerSub<T>(
    action: WorkerActions,
    unSub: UnsubscribeWorkerAction,
  ): Observable<T> {
    if (this.subs[unSub.key] === undefined) {
      this.subs[unSub.key] = new BehaviorSubject<T>(undefined);

      this.workerService.send(action);

      this.subs[unSub.key].subscribe(x => {}, null, () => {
        this.workerService.send(unSub);
      });
    }

    return this.subs[unSub.key].asObservable();
  }
}

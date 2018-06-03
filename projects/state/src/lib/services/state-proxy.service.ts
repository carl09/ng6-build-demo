import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { debounce } from 'rxjs/operators';
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

  private subWatcher: Subject<void> = new Subject();

  constructor(private workerService: WorkerService) {
    this.workerService.listen().subscribe(x => {
      if (x !== undefined && this.subs[x.reducer] !== undefined) {
        // Object.keys(this.subs).forEach(y => {
        //   const sub = this.subs[y];

        //   if (sub.observers.length === 1) {
        //     sub.complete();
        //     delete this.subs[y];
        //   }
        // });

        // if (this.subs[x.reducer]) {
        this.subs[x.reducer].next(x.payload);

        this.subWatcher.next();
        // }
      }
    });

    this.subWatcher.pipe(debounce(() => timer(1000))).subscribe(() => {
      Object.keys(this.subs).forEach(y => {
        const sub = this.subs[y];

        if (sub.observers.length === 1) {
          sub.complete();
          delete this.subs[y];
          console.log(`Unscribing ${y}`);
        }
      });
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

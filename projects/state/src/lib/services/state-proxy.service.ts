import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
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

          if (sub.observers.length === 0) {
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
    if (this.subs[path] === undefined) {
      console.log('Crating Sub', path);
      this.subs[path] = new BehaviorSubject<K>(undefined);

      const source = instrument(this.subs[path]);
      const published = source.publish();
    }

    this.workerService.send({
      action: 'listen',
      payload: path,
    });

    return this.subs[path].asObservable();
  }

  public dispatch<V extends Action = Action>(action: V): void {
    this.workerService.send({
      action: 'reducer',
      payload: action,
    });
  }

  public execute<T>(method: string, ...args: any[]): Observable<T> {
    if (this.subs[method] === undefined) {
      this.subs[method] = new BehaviorSubject<T>(undefined);
    }

    this.workerService.send({
      action: 'execute',
      key: method,
      payload: args,
    });

    return this.subs[method].asObservable();
  }

  // return this.stateProxyService.execute<IProduct>(
  //   'ProductService.getProductByCode',
  //   code,
  // );
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

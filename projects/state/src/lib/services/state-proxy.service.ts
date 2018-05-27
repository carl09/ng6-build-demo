import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { WorkerClientService } from './worker-client.service';

@Injectable({
  providedIn: 'root',
})
export class StateProxyService {
  private subs: { [id: string]: BehaviorSubject<any> } = {};

  constructor(private workerClientService: WorkerClientService) {
    this.workerClientService.listen().subscribe(x => {
      console.log('StateService', x);
      if (x !== undefined && this.subs[x.reducer] !== undefined) {
        this.subs[x.reducer].next(x.payload);
      }
    });
  }

  public select<K = any>(path: string): Observable<K> {
    if (this.subs[path] === undefined) {
      this.subs[path] = new BehaviorSubject<K>(undefined);
    }

    this.workerClientService.send({
      action: 'listen',
      payload: path,
    });

    return this.subs[path].asObservable();
  }

  public dispatch<V extends Action = Action>(action: V): void {
    this.workerClientService.send({
      action: 'reducer',
      payload: action,
    });
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface IWorkerMessage {
  reducer: string;
  payload: any;
}

export interface IWorkerAction {
  action: string;
  payload: any;
}

@Injectable()
export class WorkerClientService {
  public listnerSubject: BehaviorSubject<IWorkerMessage>;

  private worker: Worker;

  constructor() {
    this.listnerSubject = new BehaviorSubject<IWorkerMessage>(undefined);
  }

  public start(script: string) {
    this.worker = new Worker(script);

    this.worker.addEventListener('message', message => {
      console.log('message', message);
      this.listnerSubject.next(message.data);
    });
  }

  public listen(): Observable<IWorkerMessage> {
    return this.listnerSubject.asObservable();
  }

  public send(message: IWorkerAction) {
    this.worker.postMessage(message);
  }

  public stop() {
    this.worker.terminate();
    this.worker = undefined;
  }
}

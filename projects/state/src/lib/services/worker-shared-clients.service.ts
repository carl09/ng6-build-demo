import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IWorkerAction, IWorkerMessage } from '../models';

@Injectable()
export class WorkerSharedClientService {
  public listnerSubject: BehaviorSubject<IWorkerMessage>;

  private worker: SharedWorker.SharedWorker;

  constructor() {
    this.listnerSubject = new BehaviorSubject<IWorkerMessage>(undefined);
  }

  public start(script: string) {
    this.worker = new SharedWorker(script);

    this.worker.port.addEventListener('message', message => {
      console.log('message', message);
      this.listnerSubject.next(message.data);
    });

    this.worker.port.start();
  }

  public listen(): Observable<IWorkerMessage> {
    return this.listnerSubject.asObservable();
  }

  public send(message: IWorkerAction) {
    if (this.worker) {
      this.worker.port.postMessage(message);
    }
  }

  public stop() {
    this.worker.port.close();
    this.worker = undefined;
  }
}

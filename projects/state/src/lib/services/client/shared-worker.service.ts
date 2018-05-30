import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IWorkerAction, IWorkerMessage } from '../../models';
import { WorkerService } from './worker.service';

// declare const SharedWorker: SharedWorker.SharedWorker;

@Injectable()
export class WorkerSharedService extends WorkerService {
  public listnerSubject: BehaviorSubject<IWorkerMessage>;

  private worker: SharedWorker.SharedWorker;

  constructor() {
    super();
    this.listnerSubject = new BehaviorSubject<IWorkerMessage>(undefined);
  }

  public start(script: string) {
    this.worker = new SharedWorker(script, 'Reducer Worker');

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

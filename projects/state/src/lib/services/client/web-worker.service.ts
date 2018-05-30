import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IWorkerAction, IWorkerMessage } from '../../models';
import { WorkerService } from './worker.service';

@Injectable()
export class WebWorkerService extends WorkerService {
  public listnerSubject: BehaviorSubject<IWorkerMessage>;

  private worker: Worker;

  constructor() {
    super();
    this.listnerSubject = new BehaviorSubject<IWorkerMessage>(undefined);
  }

  public start(script: string): void {
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
    if (this.worker) {
      this.worker.postMessage(message);
    }
  }

  public stop() {
    this.worker.terminate();
    this.worker = undefined;
  }
}

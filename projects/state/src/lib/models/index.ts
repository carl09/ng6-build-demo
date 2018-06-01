import { Subscription } from 'rxjs';
import { currencyTypes } from './currency.models';
import {
  ActionType,
  createActionUnsubscribeKey,
  WorkerActions,
} from './worker-action.model';

export * from './worker-action.model';

export interface IWorkerMessage {
  reducer: string;
  payload: any;
}

export class SubScriptionManager {
  public key: string;
  public subscription: Subscription;

  constructor(workerAction: WorkerActions) {
    this.key = createActionUnsubscribeKey(workerAction);
  }
}

export interface IProduct {
  code: string;
  name: string;
  img: string;
  unitPrice: number;
}

export interface IProductSummary {
  code: string;
  name: string;
  img: string;
  price: number;
  currency: currencyTypes;
}

export interface IUser {
  username?: string;
  currency?: currencyTypes;
  viewedProducts?: string[];
}

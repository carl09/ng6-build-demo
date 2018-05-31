import { Subscription } from 'rxjs';

export interface IWorkerMessage {
  reducer: string;
  payload: any;
}

export interface IWorkerAction {
  action: ActionType;
  key?: string;
  payload: any;
}

export interface ISubScriptionManager {
  action: ActionType;
  key: string;
  subscription?: Subscription;
}

export type ActionType = 'reducer' | 'listen' | 'execute' | 'unsubscribe';

export interface IProduct {
  code: string;
  name: string;
  img: string;
  price: number;
  currency: string;
}

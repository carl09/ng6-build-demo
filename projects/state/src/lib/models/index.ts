export interface IWorkerMessage {
  reducer: string;
  payload: any;
}

export interface IWorkerAction {
  action: ActionType;
  payload: any;
}

export type ActionType = 'reducer' | 'listen';

export interface IProduct {
  code: string;
  name: string;
  img: string;
  price: number;
  currency: string;
}

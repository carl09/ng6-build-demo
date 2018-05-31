export interface IWorkerMessage {
  reducer: string;
  payload: any;
}

export interface IWorkerAction {
  action: ActionType;
  key?: string;
  payload: any;
}

export type ActionType = 'reducer' | 'listen' | 'execute';

export interface IProduct {
  code: string;
  name: string;
  img: string;
  price: number;
  currency: string;
}

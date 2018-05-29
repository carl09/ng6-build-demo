export interface IWorkerMessage {
  reducer: string;
  payload: any;
}

export interface IWorkerAction {
  action: string;
  payload: any;
}

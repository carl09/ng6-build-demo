// tslint:disable:max-classes-per-file
import { Action } from '@ngrx/store';
import { IProduct } from '../models';

export const INCREMENT = 'INCREMENT';
export class IncrementAction implements Action {
  public readonly type = INCREMENT;
}

export const DECREMENT = 'DECREMENT';
export class DecrementAction implements Action {
  public readonly type = DECREMENT;
}

export const LOAD_PRODUCTS = 'LOAD_PRODUCTS';
export interface ILoadProductsActionPayload {
  products: IProduct[];
}

export class LoadProductsAction implements Action {
  public readonly type = LOAD_PRODUCTS;
  constructor(public payload: ILoadProductsActionPayload) {}
}

export type Actions = IncrementAction | DecrementAction | LoadProductsAction;

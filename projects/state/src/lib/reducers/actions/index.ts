// tslint:disable:max-classes-per-file
import { Action } from '@ngrx/store';
import { IProduct } from '../../models';
import { productsActions } from './products.actions';
import { userActions } from './user.actions';

export * from './products.actions';
export * from './user.actions';

export const INCREMENT = 'INCREMENT';
export class IncrementAction implements Action {
  public readonly type = INCREMENT;
}

export const DECREMENT = 'DECREMENT';
export class DecrementAction implements Action {
  public readonly type = DECREMENT;
}

export type Actions =
  | IncrementAction
  | DecrementAction
  | productsActions
  | userActions;

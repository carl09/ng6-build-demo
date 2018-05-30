import { Action, ActionReducer, ActionReducerMap } from '@ngrx/store';
import { IProduct } from '../models';
import { counterReducer } from './counter.reducer';
import { productsReducer } from './products.reducer';

export interface IState {
  counter: number;
  products: IProduct[];
}

export const reducers: ActionReducerMap<IState> = {
  counter: counterReducer,
  products: productsReducer,
};

import { Action, ActionReducer, ActionReducerMap } from '@ngrx/store';
import { IProduct, IUser } from '../models';
import { counterReducer } from './counter.reducer';
import { productsReducer } from './products.reducer';
import { userReducer } from './user.reducer';

export interface IState {
  counter: number;
  products: IProduct[];
  user: IUser;
}

export const reducers: ActionReducerMap<IState> = {
  counter: counterReducer,
  products: productsReducer,
  user: userReducer,
};

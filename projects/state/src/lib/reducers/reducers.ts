import {
  Action,
  ActionReducer,
  ActionReducerMap,
  createSelector,
  MemoizedSelector,
} from '@ngrx/store';
import { IProduct, IProductSummary, IUser } from '../models';
import { convertCurrency, currencyTypes } from '../models/currency.models';
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

export const selectUser = (state: IState) => state.user;
export const selectProducts = (state: IState) => state.products;

export const selectProductsForDisplay: MemoizedSelector<
  IState,
  IProductSummary[]
> = createSelector(
  selectUser,
  selectProducts,
  (user: IUser, products: IProduct[]) => {
    const items = [];

    const currency: currencyTypes = user.currency || 'USD';

    products.forEach(x => {
      const i: IProductSummary = {
        code: x.code,
        name: x.name,
        img: x.img,
        price: convertCurrency(currency, x.unitPrice),
        currency,
      };
      items.push(i);
    });

    console.log('selectProductsForDisplay', products, items);

    return items;
  },
);

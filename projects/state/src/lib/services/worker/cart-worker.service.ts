import { Injectable } from '@angular/core';
import { createSelector, MemoizedSelector, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { CartService } from '../../common/cart.service';
import { ProductsService } from '../../common/products.service';
import { IProduct, IProductSummary, IUser } from '../../models';
import {
  convertCurrency,
  currencyTypes,
  DEFAULT_CURRENCY,
} from '../../models/currency.models';
import { LoadProductsAction } from '../../reducers/actions';
import { ViewedProductAction } from '../../reducers/actions/user.actions';
import { productsReducer } from '../../reducers/products.reducer';
import { IState } from '../../reducers/reducers';
import { ICart, ICartSummary } from './../../models/index';
import { selectGetCurrency } from './user-worker.service';

interface IProductForCart {
  name: string;
  price: number;
  currency: currencyTypes;
}

const selectUser = (state: IState) => state.user;
const selectProducts = (state: IState) => state.products;
const selectCart = (state: IState) => state.cart;

const selectProductsForCart: MemoizedSelector<
  IState,
  { [id: string]: IProductForCart }
> = createSelector(
  selectGetCurrency,
  selectProducts,
  (userCurrency: currencyTypes, products: IProduct[]) => {
    const result = {};

    const currency: currencyTypes = userCurrency;

    products.forEach(x => {
      result[x.code] = {
        name: x.name,
        price: convertCurrency(currency, x.unitPrice),
        currency,
      };
    });

    return result;
  },
);

const selectCartTotal: MemoizedSelector<IState, number> = createSelector(
  selectProductsForCart,
  selectCart,
  (products: { [id: string]: IProductForCart }, cart: ICart) => {
    let result = 0;

    cart.items.forEach(i => {
      result += products[i.productCode].price * i.qty;
    });

    return result;
  },
);

const selectCartSummary: MemoizedSelector<
  IState,
  ICartSummary[]
> = createSelector(
  selectProductsForCart,
  selectCart,
  (products: { [id: string]: IProductForCart }, cart: ICart) => {
    const result: ICartSummary[] = [];

    cart.items.forEach(i => {
      result.push({
        productCode: i.productCode,
        name: products[i.productCode].name,
        qty: i.qty,
        itemPrice: products[i.productCode].price,
        totalPrice: products[i.productCode].price * i.qty,
        currency: products[i.productCode].currency,
      });
    });

    return result;
  },
);

@Injectable()
export class CartWorkerService extends CartService {
  constructor(private store: Store<IState>) {
    super();
  }

  public getCartTotal(): Observable<number> {
    return this.store.pipe(select(selectCartTotal));
  }

  public getCartSummary(): Observable<ICartSummary[]> {
    return this.store.pipe(select(selectCartSummary));
  }
}

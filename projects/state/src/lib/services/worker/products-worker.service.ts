import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createSelector, MemoizedSelector, select, Store } from '@ngrx/store';
import { MonoTypeOperatorFunction, Observable, OperatorFunction } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
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
import { selectGetCurrency } from './user-worker.service';

const selectUser = (state: IState) => state.user;
const selectProducts = (state: IState) => state.products;

const selectProductsForDisplay: MemoizedSelector<
  IState,
  IProductSummary[]
> = createSelector(
  // selectUser,
  selectGetCurrency,
  selectProducts,
  (userCurrency: currencyTypes, products: IProduct[]) => {
    const items = [];

    const currency: currencyTypes = userCurrency || DEFAULT_CURRENCY;

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

    return items;
  },
);

@Injectable()
export class ProductsWorkerService extends ProductsService {
  constructor(private store: Store<IState>, private http: HttpClient) {
    super();
  }

  public loadProducts() {
    this.http.get('products.json').subscribe((resp: IProduct[]) => {
      this.store.dispatch(
        new LoadProductsAction({
          products: resp,
        }),
      );
    });
  }

  public getProductByCode(code: string): Observable<IProductSummary> {
    // console.log('ProductsWorkerService.getProductByCode', code);
    return this.store.pipe(
      select(selectProductsForDisplay),
      map(x => {
        // console.log('Inside reducer:', x);
        const items = x.filter(y => y.code === code);
        return items[0];
      }),
      tap(x => {
        this.store.dispatch(
          new ViewedProductAction({
            productCode: code,
          }),
        );
      }),
    );
  }

  public getProducts(): Observable<IProductSummary[]> {
    return this.store.pipe(select(selectProductsForDisplay));
  }
}

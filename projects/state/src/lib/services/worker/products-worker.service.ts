import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { MonoTypeOperatorFunction, Observable, OperatorFunction } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ProductsService } from '../../common/products.service';
import { IProduct, IProductSummary } from '../../models';
import { LoadProductsAction } from '../../reducers/actions';
import { productsReducer } from '../../reducers/products.reducer';
import { IState, selectProductsForDisplay } from '../../reducers/reducers';

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

  public getProductByCode(code: string): Observable<IProduct> {
    console.log('ProductsWorkerService.getProductByCode', code);
    return this.store.pipe(
      select(x => x.products),
      map(x => {
        console.log('Inside reducer:', x);
        const items = x.filter(y => y.code === code);
        return items[0];
      }),
    );
  }

  public getProducts(): Observable<IProductSummary[]> {
    return this.store.pipe(select(selectProductsForDisplay));
  }
}

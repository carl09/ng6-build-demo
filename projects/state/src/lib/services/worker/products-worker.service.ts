// tslint:disable-next-line:no-submodule-imports
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { MonoTypeOperatorFunction, Observable, OperatorFunction } from 'rxjs';
// tslint:disable-next-line:no-submodule-imports
import { filter, map } from 'rxjs/operators';
import { ProductsService } from '../../common/products.service';
import { IProduct } from '../../models';
import { LoadProductsAction } from '../../reducers/actions';
import { productsReducer } from '../../reducers/products.reducer';
import { IState } from '../../reducers/reducers';

@Injectable()
export class ProductsWorkerService extends ProductsService {
  public methods: { [id: string]: (args: any[]) => Observable<any> } = {
    'ProductService.getProductByCode': (args: any[]) => {
      console.log('pre call method', args[0]);
      return this.getProductByCode(args[0]);
    },
  };

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
}

function firstItem<T>(): MonoTypeOperatorFunction<T> {
  if (Array.isArray(this) && this.length !== 0) {
    return this[0];
  }
  return undefined;
}

// tslint:disable-next-line:no-submodule-imports
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { IProduct } from '../../models';
import { LoadProductsAction } from '../../reducers/actions';

@Injectable()
export class ProductsService {
  constructor(private store: Store<any>, private http: HttpClient) {}

  public loadProducts() {
    this.http.get('products.json').subscribe((resp: IProduct[]) => {
      debugger;
      this.store.dispatch(
        new LoadProductsAction({
          products: resp,
        }),
      );
    });
  }
}

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProductsService } from '../../common/products.service';
import { IProduct } from '../../models';
import { StateProxyService } from '../state-proxy.service';

@Injectable()
export class ProductsClientService extends ProductsService {
  constructor(private stateProxyService: StateProxyService) {
    super();
  }

  public getProductByCode(code: string): Observable<IProduct> {
    return this.stateProxyService.execute<IProduct>(
      'ProductService.getProductByCode',
      code,
    );
  }
}

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProductsService } from '../../common/products.service';
import { IProduct, IProductSummary } from '../../models';
import { StateProxyService } from '../state-proxy.service';

@Injectable()
export class ProductsClientService extends ProductsService {
  constructor(private stateProxyService: StateProxyService) {
    super();
  }

  public getProductByCode(code: string): Observable<IProductSummary> {
    return this.stateProxyService.execute<IProductSummary>(
      this.methodGetProductByCode,
      code,
      code,
    );
  }

  public getProducts(): Observable<IProductSummary[]> {
    return this.stateProxyService.execute<IProductSummary[]>(
      this.methodGetProducts,
      '',
    );
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartService } from '../../common/cart.service';
import { UserService } from '../../common/user.service';
import { ICartSummary } from '../../models';
import { currencyTypes } from '../../models/currency.models';
import { StateProxyService } from '../state-proxy.service';

@Injectable()
export class CartClientService extends CartService {
  constructor(private stateProxyService: StateProxyService) {
    super();
  }

  public getCartTotal(): Observable<number> {
    return this.stateProxyService.execute<number>(this.methodGetCartTotal, '');
  }

  public getCartSummary(): Observable<ICartSummary[]> {
    return this.stateProxyService.execute<ICartSummary[]>(
      this.methodGetCartSummary,
      '',
    );
  }
}

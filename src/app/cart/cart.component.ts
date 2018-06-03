import { Component, OnInit } from '@angular/core';
import { ICartSummary } from 'dist/state/lib/models';
import { Observable } from 'rxjs';
import {
  CartAddAction,
  CartRemoveAction,
  CartService,
  StateProxyService,
} from 'state';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  summary$: Observable<ICartSummary[]>;

  constructor(
    private cartService: CartService,
    private store: StateProxyService,
  ) {}

  public ngOnInit(): void {
    this.summary$ = this.cartService.getCartSummary();
  }

  public remove(productCode: string) {
    this.store.dispatch(
      new CartRemoveAction({
        productCode,
        qty: 1,
      }),
    );
  }

  public add(productCode: string) {
    this.store.dispatch(
      new CartAddAction({
        productCode,
        qty: 1,
      }),
    );
  }
}

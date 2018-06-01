import { Component, OnInit } from '@angular/core';
import { ICartSummary } from 'dist/state/lib/models';
import { Observable } from 'rxjs';
import { CartService } from 'state';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  summary$: Observable<ICartSummary[]>;

  constructor(private cartService: CartService) {}

  public ngOnInit(): void {
    this.summary$ = this.cartService.getCartSummary();
  }
}

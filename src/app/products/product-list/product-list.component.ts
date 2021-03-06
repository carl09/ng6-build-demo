import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IProductSummary,
  IProductViewed,
  ProductsService,
  StateProxyService,
} from 'state';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  public products$: Observable<IProductSummary[]>;
  public productViewed$: Observable<IProductViewed[]>;

  constructor(private productsService: ProductsService) {}

  public ngOnInit(): void {
    this.products$ = this.productsService.getProducts();
    this.productViewed$ = this.productsService.getRecentProducts();
  }
}

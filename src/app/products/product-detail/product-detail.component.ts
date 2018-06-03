import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  CartAddAction,
  IProductSummary,
  ProductsService,
  StateProxyService,
} from 'state';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  public product$: Observable<IProductSummary>;

  private code: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: StateProxyService,
    private productsService: ProductsService,
  ) {}

  public ngOnInit() {
    this.product$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.code = params.get('code');

        return this.productsService.getProductByCode(this.code);
      }),
    );
  }

  public addToCart() {
    this.store.dispatch(
      new CartAddAction({
        productCode: this.code,
        qty: 1,
      }),
    );
  }

  public back() {
    this.router.navigate(['/products']);
  }
}

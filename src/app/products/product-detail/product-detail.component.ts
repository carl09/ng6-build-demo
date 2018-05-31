import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ProductsService, StateProxyService } from 'state';

export interface IProductDetail {
  code: string;
  //   name: string;
  //   img: string;
  //   price: number;
  //   currency: string;
}

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  public product$: Observable<IProductDetail>;

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

        console.log('ProductDetailComponent', this.code);

        return this.productsService.getProductByCode(this.code);
      }),
    );
  }

  public back() {
    this.router.navigate(['/products']);
  }
}

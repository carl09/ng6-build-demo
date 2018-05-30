import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
// tslint:disable-next-line:no-submodule-imports
import { map, switchMap } from 'rxjs/operators';
import { StateProxyService } from 'state';

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
  ) {}

  public ngOnInit() {
    this.product$ = this.route.paramMap.pipe(
      map((params: ParamMap) => {
        this.code = params.get('code');
        return {
          code: this.code,
        };
      }),
    );
  }

  public back() {
    this.router.navigate(['/products']);
  }
}

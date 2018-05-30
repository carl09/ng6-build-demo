import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StateProxyService } from 'state';

export interface IProductSummary {
  code: string;
  name: string;
  img: string;
  price: number;
  currency: string;
}

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  public products$: Observable<IProductSummary[]>;

  constructor(private store: StateProxyService) {
    // for (let i = 0; i < 10; i++) {
    //   this.products.push({
    //     code: i.toString(),
    //     name: `Shimano Dura Ace 9000 11 Speed Chain ${i}`,
    //     // img: 'http://via.placeholder.com/200x200',
    //     img: 'assets/products/Dura-Ace-Chain-xtr.jpg',
    //     price: 52.68,
    //     currency: 'AUD',
    //   });
    // }
    // this.counter$ = this.store.select<number>('counter');
  }

  public ngOnInit(): void {
    this.products$ = this.store.select<IProductSummary[]>('products');
  }
}

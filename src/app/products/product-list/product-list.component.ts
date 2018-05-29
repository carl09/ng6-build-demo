import { Component } from '@angular/core';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent {
  public products: any[] = [];

  constructor() {
    for (let i = 0; i < 10; i++) {
      this.products.push({
        value: i,
      });
    }
  }
}

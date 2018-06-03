import { Component, Input } from '@angular/core';
import { IProductViewed } from 'state';

@Component({
  selector: 'app-product-recent',
  templateUrl: './product-recent.component.html',
  styleUrls: ['./product-recent.component.scss'],
})
export class ProductRecentComponent {
  @Input() public productViewed: IProductViewed[];
}

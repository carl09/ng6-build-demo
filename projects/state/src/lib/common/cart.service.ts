import { Observable } from 'rxjs';
import { currencyTypes } from '../models/currency.models';
import { ICartSummary } from '../models/index';
import { IServiceWithIndex } from './service-with-index.model';

export abstract class CartService implements IServiceWithIndex {
  protected readonly methodGetCartTotal = 'CartService.getCartTotal';
  protected readonly methodGetCartSummary = 'CartService.getCartSummary';

  public methods: { [id: string]: (args: any[]) => Observable<any> } = {};

  constructor() {
    this.methods[this.methodGetCartTotal] = (args: any[]) =>
      this.getCartTotal();

    this.methods[this.methodGetCartSummary] = (args: any[]) =>
      this.getCartSummary();
  }

  public abstract getCartTotal(): Observable<number>;

  public abstract getCartSummary(): Observable<ICartSummary[]>;
}

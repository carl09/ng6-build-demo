import { Observable } from 'rxjs';
import { IProductSummary } from '../models/index';
import { IServiceWithIndex } from './service-with-index.model';

export abstract class ProductsService implements IServiceWithIndex {
  protected readonly methodGetProductByCode = 'ProductService.getProductByCode';
  protected readonly methodGetProducts = 'ProductService.getProducts';

  public methods: { [id: string]: (args: any[]) => Observable<any> } = {};

  constructor() {
    this.methods[this.methodGetProductByCode] = (args: any[]) =>
      this.getProductByCode(args[0]);

    this.methods[this.methodGetProducts] = (_args: any[]) => this.getProducts();
  }

  public abstract getProductByCode(code: string): Observable<IProductSummary>;

  public abstract getProducts(): Observable<IProductSummary[]>;
}

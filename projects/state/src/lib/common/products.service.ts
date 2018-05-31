import { Observable } from 'rxjs';
import { IProduct } from '../models/index';

export abstract class ProductsService {
  public abstract getProductByCode(code: string): Observable<IProduct>;
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../../common/user.service';
import { currencyTypes } from '../../models/currency.models';
import { StateProxyService } from '../state-proxy.service';

@Injectable()
export class UserClientService extends UserService {
  constructor(private stateProxyService: StateProxyService) {
    super();
  }

  public isAuthencated(): Observable<boolean> {
    return this.stateProxyService.execute<boolean>(
      this.methodIsAuthencated,
      '',
    );
  }

  public getCurrency(): Observable<currencyTypes> {
    return this.stateProxyService.execute<currencyTypes>(
      this.methodGetCurrency,
      '',
    );
  }
}

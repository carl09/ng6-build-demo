import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material';
import { Observable } from 'rxjs';
import {
  IUser,
  SetCurrencyAction,
  StateProxyService,
  UserService,
} from 'state';
import { currencyTypes } from '../../projects/state/src/lib/models/currency.models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public isAuthencated$: Observable<boolean>;
  public selected: currencyTypes;
  public currencies: currencyTypes[];

  constructor(
    private userService: UserService,
    private store: StateProxyService,
  ) {}

  public ngOnInit(): void {
    this.isAuthencated$ = this.userService.isAuthencated();
    this.currencies = this.userService.getAvaliableCurrencys();

    this.userService.getCurrency().subscribe(x => {
      console.log('getCurrency', x);
      this.selected = x;
    });
  }

  public onSelectionChange(event: MatSelectChange) {
    console.log('onSelectionChange', event);
    this.store.dispatch(
      new SetCurrencyAction({
        currency: event.value,
      }),
    );
  }
}

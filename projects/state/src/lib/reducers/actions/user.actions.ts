// tslint:disable:max-classes-per-file
import { Action } from '@ngrx/store';
import { currencyTypes } from '../../models/currency.models';

export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGOFF = 'USER_LOGOFF';
export const USER_SET_CURRENCY = 'USER_SET_CURRENCY';

export interface ILoginActionPayload {
  username: string;
}

export interface ISetCurrencyActionPayload {
  currency: currencyTypes;
}

export class LoginAction implements Action {
  public readonly type = USER_LOGIN;
  constructor(public payload: ILoginActionPayload) {}
}

export class LogoffAction implements Action {
  public readonly type = USER_LOGOFF;
  constructor() {}
}

export class SetCurrencyAction implements Action {
  public readonly type = USER_SET_CURRENCY;
  constructor(public payload: ISetCurrencyActionPayload) {}
}

export type userActions = LoginAction | LogoffAction | SetCurrencyAction;

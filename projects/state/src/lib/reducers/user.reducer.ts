import { Action, ActionReducer } from '@ngrx/store';
import { IUser } from '../models';
import { DEFAULT_CURRENCY, currencyTypes } from '../models/currency.models';
import * as reducerActions from './actions';
import { USER_SET_CURRENCY } from './actions/user.actions';

export const userReducer: ActionReducer<IUser> = (
  state: IUser = {},
  action: reducerActions.Actions,
) => {
  switch (action.type) {
    case reducerActions.USER_LOGIN:
      return login(action.payload.username);
    case reducerActions.USER_LOGOFF:
      return logoff();
    case reducerActions.USER_SET_CURRENCY:
      return setCurrency(state, action.payload.currency);
    default:
      return state;
  }
};

function login(username: string): IUser {
  return {
    username,
    currency: DEFAULT_CURRENCY,
  };
}

function logoff(): IUser {
  return {};
}

function setCurrency(state: IUser, currency: currencyTypes): IUser {
  return {
    username: state.username,
    currency,
  };
}

import { Action, ActionReducer, ActionReducerMap } from '@ngrx/store';

/*
    Default parameter will be used for initial state unless initial
    state is provided for this reducer in 'provideStore' method.
 */
export const Counter: ActionReducer<number> = (
  state: number = 0,
  action: Action,
) => {
  console.log('Counter', action.type);
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
};

export interface IState {
  counter: any;
}

export const reducers: ActionReducerMap<IState> = {
  counter: Counter,
};

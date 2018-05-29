import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { StateProxyService } from 'state';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
})
export class CounterComponent {
  counter$: Observable<number>;

  constructor(private store: StateProxyService) {
    this.counter$ = this.store.select<number>('counter');
  }

  increment() {
    this.store.dispatch({ type: 'INCREMENT' });
  }

  decrement() {
    this.store.dispatch({ type: 'DECREMENT' });
  }

  incrementAsync() {
    setTimeout(() => {
      this.store.dispatch({ type: 'INCREMENT' });
    }, 1000);
  }

  decrementAsync() {
    setTimeout(() => {
      this.store.dispatch({ type: 'DECREMENT' });
    }, 1000);
  }
}

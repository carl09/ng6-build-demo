import { Routes } from '@angular/router';
import { CounterComponent } from './counter/counter.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { LoginComponent } from './user/login/login.component';
import { LogoffComponent } from './user/logoff/logoff.component';

export const appRoutes: Routes = [
  { path: 'counter', component: CounterComponent },
  { path: 'user/login', component: LoginComponent },
  { path: 'user/logoff', component: LogoffComponent },

  { path: 'products/list', component: ProductListComponent },

  { path: '', redirectTo: '/counter', pathMatch: 'full' },
  // { path: '**', component: CounterComponent },
];

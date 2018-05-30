import { Routes } from '@angular/router';
import { CounterComponent } from './counter/counter.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { LoginComponent } from './user/login/login.component';
import { LogoffComponent } from './user/logoff/logoff.component';

export const appRoutes: Routes = [
  { path: 'counter', component: CounterComponent },
  { path: 'user/login', component: LoginComponent },
  { path: 'user/logoff', component: LogoffComponent },

  { path: 'products', component: ProductListComponent },
  { path: 'products/list', component: ProductListComponent },
  { path: 'products/:code', component: ProductDetailComponent },

  { path: '', redirectTo: '/counter', pathMatch: 'full' },
  // { path: '**', component: CounterComponent },
];

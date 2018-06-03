import { CdkTableModule } from '@angular/cdk/table';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatSelectModule,
  MatTableModule,
  MatToolbarModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { StateClientModule, WorkerService } from 'state';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { CartComponent } from './cart/cart.component';
import { CounterComponent } from './counter/counter.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductRecentComponent } from './products/product-recent/product-recent.component';
import { AppCurrencyPipe } from './shared/app-currency.pipe';
import { LoginComponent } from './user/login/login.component';
import { LogoffComponent } from './user/logoff/logoff.component';

@NgModule({
  declarations: [
    AppComponent,
    CounterComponent,
    LogoffComponent,
    LoginComponent,
    ProductListComponent,
    ProductDetailComponent,
    ProductRecentComponent,
    CartComponent,

    AppCurrencyPipe,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,

    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,

    MatTableModule,
    CdkTableModule,

    StateClientModule.forRoot(false),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(workerService: WorkerService) {
    workerService.start('assets/webworker.js');
  }
}

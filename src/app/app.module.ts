import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatToolbarModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
// tslint:disable-next-line:no-submodule-imports
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { StateClientModule, WorkerClientService } from 'state';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { CounterComponent } from './counter/counter.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { LoginComponent } from './user/login/login.component';
import { LogoffComponent } from './user/logoff/logoff.component';

@NgModule({
  declarations: [
    AppComponent,
    CounterComponent,
    LogoffComponent,
    LoginComponent,
    ProductListComponent,
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
    StateClientModule.forRoot(),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(workerClientService: WorkerClientService) {
    workerClientService.start('assets/webworker.js');
  }
}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StateClientModule, WorkerClientService } from 'state';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, StateClientModule.forRoot()],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(workerClientService: WorkerClientService) {
    workerClientService.start('assets/webworker.js');
  }
}

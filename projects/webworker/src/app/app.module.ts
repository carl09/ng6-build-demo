import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StateWorkerModule, WorkerService } from 'state';

@NgModule({
  declarations: [],
  imports: [BrowserModule, StateWorkerModule.forRoot()],
  providers: [],
  bootstrap: [],
})
export class AppModule {
  constructor(workerService: WorkerService) {
    workerService.start();
  }
}

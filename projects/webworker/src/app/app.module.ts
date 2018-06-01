import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { WorkerAppModule } from '@angular/platform-webworker';
import { BackGroundWorkerService, StateWorkerModule } from 'state';

@NgModule({
  declarations: [],
  imports: [WorkerAppModule, HttpClientModule, StateWorkerModule.forRoot()],
  providers: [],
  bootstrap: [],
})
export class AppModule {
  constructor(backGroundWorkerService: BackGroundWorkerService) {
    backGroundWorkerService.start();
  }
  ngDoBootstrap() {}
}

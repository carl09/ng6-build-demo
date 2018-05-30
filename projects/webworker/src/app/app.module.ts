import { APP_BASE_HREF } from '@angular/common';
// tslint:disable-next-line:no-submodule-imports
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { WorkerAppModule } from '@angular/platform-webworker';
import { BackGroundWorkerService, StateWorkerModule } from 'state';

@NgModule({
  declarations: [],
  // imports: [BrowserModule, HttpClientModule, StateWorkerModule.forRoot()],
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

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// import { platformWorkerAppDynamic } from '@angular/platform-webworker-dynamic';
import { AppModule } from './app/app.module';
import './polyfills';

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    ngZone: 'noop',
  })
  .catch(err => console.log(err));

// platformWorkerAppDynamic().bootstrapModule(AppModule, { ngZone: 'noop' });

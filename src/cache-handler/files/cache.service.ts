

  import {ApplicationRef, Inject, Injectable, Injector } from '@angular/core';
  import { SwUpdate } from '@angular/service-worker';
  import { concat, interval } from 'rxjs';
  import { first } from 'rxjs/operators';
  
  @Injectable({
    providedIn: 'root'
  })
  export class CacheService {

    constructor(private updates: SwUpdate, private injector: Injector) {
    }

    initilizeCache() {
      console.log("cache service !!");
      this.updates.available.subscribe(event => {
          console.log('current version is', event.current);
          console.log('available version is', event.available);
        });
        this.updates.activated.subscribe(event => {
          console.log('old version was', event.previous);
          console.log('new version is', event.current);
        });
        this.updates.available.subscribe(event => {
          if (confirm("Hi!! A new version of your app has been dployed. Do you want to load the latest versiion.")) {
            this.updates.activateUpdate().then(() => document.location.reload());
          }
        });
        // Allow the app to stabilize first, before starting polling for updates with `interval()`.
        const appIsStable$ = this.injector.get(ApplicationRef).isStable.pipe(first(isStable => isStable === true));
        const everySixHours$ = interval(15 * 1000);
        const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);
      
        everySixHoursOnceAppIsStable$.subscribe(() => this.updates.checkForUpdate());
    }
  }
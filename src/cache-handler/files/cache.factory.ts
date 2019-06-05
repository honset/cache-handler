import { Injector } from '@angular/core/';
import { CacheService } from './cache.service';
import { LOCATION_INITIALIZED } from '@angular/common/';

// injector hack is used for aot build to work on ie.need to remove when angular or cli fix this in their release -KG
// refer https://github.com/angular/angular-cli/issues/5762

export function subscribeSWEvetns(cacheService: CacheService) {  
    return () => new Promise(resolve => {
        cacheService.initilizeCache();
        resolve(null);
      });
}
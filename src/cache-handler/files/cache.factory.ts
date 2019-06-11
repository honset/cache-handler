import { CacheService } from './cache.service';

export function subscribeSwEvents(cacheService: CacheService) {
    return () => new Promise(resolve => {
        cacheService.initializeCache();
        resolve(null);
    });
}
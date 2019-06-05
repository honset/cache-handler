import { Injector } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
export declare class CacheService {
    private updates;
    private injector;
    constructor(updates: SwUpdate, injector: Injector);
    initializeCache(): void;
}

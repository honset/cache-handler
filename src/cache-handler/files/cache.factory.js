"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function subscribeSwEvents(cacheService) {
    return () => new Promise(resolve => {
        cacheService.initializeCache();
        resolve(null);
    });
}
exports.subscribeSwEvents = subscribeSwEvents;
//# sourceMappingURL=cache.factory.js.map
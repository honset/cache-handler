"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
let CacheService = class CacheService {
    constructor(updates, injector) {
        this.updates = updates;
        this.injector = injector;
    }
    ;
    initializeCache() {
        this.updates.available.subscribe(event => {
            console.log('current version is', event.current);
            console.log('available version is', event.available);
        });
        this.updates.activated.subscribe(event => {
            console.log('old version was', event.previous);
            console.log('new version is', event.current);
        });
        this.updates.available.subscribe(event => {
            if (confirm("Hi!! A new version of your app has been deployed. Do you want to load the newer version.")) {
                this.updates.activateUpdate().then(() => document.location.reload());
            }
        });
        const appIsStable$ = this.injector.get(core_1.ApplicationRef).isStable.pipe(operators_1.first(isStable => isStable === true));
        const everySixHours$ = rxjs_1.interval(60 * 1000);
        const everySixHoursOnceAppIsStable$ = rxjs_1.concat(appIsStable$, everySixHours$);
        everySixHoursOnceAppIsStable$.subscribe(() => this.updates.checkForUpdate());
    }
};
CacheService = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    })
], CacheService);
exports.CacheService = CacheService;
//# sourceMappingURL=cache.service.js.map
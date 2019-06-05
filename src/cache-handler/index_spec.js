"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular-devkit/schematics/testing");
const path = require("path");
describe('cache-handler', () => {
    const collectionPath = path.join(__dirname, '../collection.json');
    const schematicRunner = new testing_1.SchematicTestRunner('schematics', path.join(__dirname, './../collection.json'));
    const workspaceOptions = {
        name: 'workspace',
        newProjectRoot: 'projects',
        version: '0.5.0',
    };
    const appOptions = {
        name: 'schematest'
    };
    const schemaOptions = {
        name: 'foo'
    };
    let appTree;
    beforeEach(() => {
        appTree = schematicRunner.runExternalSchematic('@schematics/angular', 'workspace', workspaceOptions);
        appTree = schematicRunner.runExternalSchematic('@schematics/angular', 'application', appOptions, appTree);
    });
    it('should create cache service', (done) => {
        const runner = new testing_1.SchematicTestRunner('schematics', collectionPath);
        runner.runSchematicAsync('cache-handler', {project: 'schematest'}, appTree).toPromise().then(tree => {
           const serviceContent = tree.readContent('/projects/schematest/src/app/shared/services/cache.service.ts');
            expect(serviceContent.indexOf('CacheService') > 0).toEqual(true);
            done();
        });
    });
    it('should create cache factory', (done) => {
        const runner = new testing_1.SchematicTestRunner('schematics', collectionPath);
        runner.runSchematicAsync('cache-handler', {project: 'schematest'}, appTree).toPromise().then(tree => {
           const serviceContent = tree.readContent('/projects/schematest/src/app/shared/services/cache.factory.ts');
            expect(serviceContent.indexOf('subscribeSWEvetns') > 0).toEqual(true);
            done();
        });
    });
    it('should import cache service in app module', (done) => {
        const runner = new testing_1.SchematicTestRunner('schematics', collectionPath);
        runner.runSchematicAsync('cache-handler', {project: 'schematest'}, appTree).toPromise().then(tree => {
           const serviceContent = tree.readContent('/projects/schematest/src/app/app.module.ts');
            expect(serviceContent.indexOf("import { CacheService } from 'src/app/shared/services/cache.service';") > 0).toEqual(true);
            done();
        });
    });
    it('should import cache factory in app module', (done) => {
        const runner = new testing_1.SchematicTestRunner('schematics', collectionPath);
        runner.runSchematicAsync('cache-handler', {project: 'schematest'}, appTree).toPromise().then(tree => {
           const serviceContent = tree.readContent('/projects/schematest/src/app/app.module.ts');
            expect(serviceContent.indexOf("import { subscribeSwEvents } from 'src/app/shared/services/cache.factory';") > 0).toEqual(true);
            done();
        });
    });
    it('should import APP_INITIALIZER in app module', (done) => {
        const runner = new testing_1.SchematicTestRunner('schematics', collectionPath);
        runner.runSchematicAsync('cache-handler', {project: 'schematest'}, appTree).toPromise().then(tree => {
           const serviceContent = tree.readContent('/projects/schematest/src/app/app.module.ts');
            expect(serviceContent.indexOf("import { NgModule, APP_INITIALIZER, Injector } from '@angular/core';") > 0).toEqual(true);
            done();
        });
    });
    it('should add APP_INITIALIZER for subscribeSwEvents in app module', (done) => {
        const runner = new testing_1.SchematicTestRunner('schematics', collectionPath);
        runner.runSchematicAsync('cache-handler', {project: 'schematest'}, appTree).toPromise().then(tree => {
           const serviceContent = tree.readContent('/projects/schematest/src/app/app.module.ts');
            expect(serviceContent.indexOf(`provide: APP_INITIALIZER,`) > 0).toEqual(true);
            done();
        });
    });
});
//# sourceMappingURL=index_spec.js.map
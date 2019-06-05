"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// You don't have to export the function as default. You can also have more than one rule factory
// per file.


const ast_utils_1 = require("@schematics/angular/utility/ast-utils");
const ng_ast_utils_1 = require("@schematics/angular/utility/ng-ast-utils");
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const project_targets_1 = require("@schematics/angular/utility/project-targets");
const ts = require("typescript");

function getWorkspace(host) {
    const possibleFiles = ['/angular.json', '/.angular.json'];
    const path = possibleFiles.filter(path => host.exists(path))[0];
    const configBuffer = host.read(path);
    if (configBuffer === null) {
        throw new schematics_1.SchematicsException(`Could not find (${path})`);
    }
    const content = configBuffer.toString();
    return {
        path,
        workspace: core_1.parseJson(content, core_1.JsonParseMode.Loose),
    };
}

function updateAppModule(options) {
    return (host, context) => {
        context.logger.debug('Updating appmodule');
        const projectTargets = project_targets_1.getProjectTargets(host, options.project);
        if (!projectTargets.build) {
            throw project_targets_1.targetBuildNotFoundError();
        }
        const mainPath = projectTargets.build.options.main;
        const modulePath = ng_ast_utils_1.getAppModulePath(host, mainPath);
        context.logger.debug(`module path: ${modulePath}`);
        // add import
        let moduleSource = getTsSourceFile(host, modulePath);
        let importModule = 'CacheService';
        let importPath = 'src/app/shared/services/cache.service';
        if (!ast_utils_1.isImported(moduleSource, importModule, importPath)) {
            const change = ast_utils_1.insertImport(moduleSource, modulePath, importModule, importPath);
            if (change) {
                const recorder = host.beginUpdate(modulePath);
                recorder.insertLeft(change.pos, change.toAdd);
                host.commitUpdate(recorder);
            }
        }

        moduleSource = getTsSourceFile(host, modulePath);
        importModule = 'subscribeSwEvents';
        importPath = 'src/app/shared/services/cache.factory';
        if (!ast_utils_1.isImported(moduleSource, importModule, importPath)) {
            const change = ast_utils_1.insertImport(moduleSource, modulePath, importModule, importPath);
            if (change) {
                const recorder = host.beginUpdate(modulePath);
                recorder.insertLeft(change.pos, change.toAdd);
                host.commitUpdate(recorder);
            }
        }

        moduleSource = getTsSourceFile(host, modulePath);
        importModule = 'APP_INITIALIZER, Injector';
        importPath = '@angular/core';
        if (!ast_utils_1.isImported(moduleSource, importModule, importPath)) {
            const change = ast_utils_1.insertImport(moduleSource, modulePath, importModule, importPath);
            if (change) {
                const recorder = host.beginUpdate(modulePath);
                recorder.insertLeft(change.pos, change.toAdd);
                host.commitUpdate(recorder);
            }
        }

        // register SW in app module
        const importText = `{
         provide: APP_INITIALIZER,
         useFactory: subscribeSwEvents,
         deps: [CacheService, Injector],
         multi: true
        }`;

        moduleSource = getTsSourceFile(host, modulePath);
        const metadataChanges = ast_utils_1.addSymbolToNgModuleMetadata(moduleSource, modulePath, 'providers', importText);
        if (metadataChanges) {
            const recorder = host.beginUpdate(modulePath);
            metadataChanges.forEach((change) => {
                recorder.insertRight(change.pos, change.toAdd);
            });
            host.commitUpdate(recorder);
        }

        return host;
    };
}

function getTsSourceFile(host, path) {
    const buffer = host.read(path);
    if (!buffer) {
        throw new schematics_1.SchematicsException(`Could not read file (${path}).`);
    }
    const content = buffer.toString();
    const source = ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);
    return source;
}

function cacheHandler(options) {
    return (host, context) => {
        if (!options.title) {
            options.title = options.project;
        }
        const { path: workspacePath, workspace } = getWorkspace(host);
        if (!options.project) {
            throw new schematics_1.SchematicsException('Option "project" is required.');
        }
        const project = workspace.projects[options.project];
        if (!project) {
            throw new schematics_1.SchematicsException(`Project is not defined in this workspace.`);
        }
        if (project.projectType !== 'application') {
            throw new schematics_1.SchematicsException(`PWA requires a project type of "application".`);
        }
        // Find all the relevant targets for the project
        const projectTargets = project.targets || project.architect;
        if (!projectTargets || Object.keys(projectTargets).length === 0) {
            throw new schematics_1.SchematicsException(`Targets are not defined for this project.`);
        }
        const buildTargets = [];
        const testTargets = [];
        for (const targetName in projectTargets) {
            const target = projectTargets[targetName];
            if (!target) {
                continue;
            }
            if (target.builder === '@angular-devkit/build-angular:browser') {
                buildTargets.push(target);
            }
            else if (target.builder === '@angular-devkit/build-angular:karma') {
                testTargets.push(target);
            }
        }

        // Setup sources for the assets files to add to the project
        const sourcePath = core_1.join(core_1.normalize(project.root), 'src/app/shared/services');
        const rootTemplateSource = schematics_1.apply(schematics_1.url('./files'), [
            schematics_1.template({ ...options }),
            schematics_1.move(core_1.getSystemPath(sourcePath)),
        ]);
        // Setup service worker schematic options
        const swOptions = { ...options };
        delete swOptions.title;
        // Chain the rules and return
        return schematics_1.chain([
            schematics_1.mergeWith(rootTemplateSource),
            updateAppModule(options)
        ])(host, context);
    };
}
exports.cacheHandler = cacheHandler;
//# sourceMappingURL=index.js.map
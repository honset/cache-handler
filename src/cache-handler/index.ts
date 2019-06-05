/**
* @license
* Copyright Google Inc. All Rights Reserved.
*
* Use of this source code is governed by an MIT-style license that can be
* found in the LICENSE file at https://angular.io/license
*/
import {
  JsonParseMode,
  experimental,
  getSystemPath,
  join,
  normalize,
  parseJson,
} from '@angular-devkit/core';
import {
  Rule,
  SchematicsException,
  Tree,
  apply,
  chain,
  externalSchematic,
  mergeWith,
  move,
  template,
  url,
} from '@angular-devkit/schematics';
import { Readable, Writable } from 'stream';
import { Schema as PwaOptions } from './schema';
import { addSymbolToNgModuleMetadata, insertImport, isImported } from '@schematics/angular/utility/ast-utils';
import { getAppModulePath } from '@schematics/angular/utility/ng-ast-utils';
import { targetBuildNotFoundError, getProjectTargets } from '@schematics/angular/utility/project-targets';
import * as ts from 'typescript';
const RewritingStream = require('parse5-html-rewriting-stream');


function getWorkspace(
  host: Tree,
): { path: string, workspace: experimental.workspace.WorkspaceSchema } {
  const possibleFiles = [ '/angular.json', '/.angular.json' ];
  const path = possibleFiles.filter(path => host.exists(path))[0];

  const configBuffer = host.read(path);
  if (configBuffer === null) {
    throw new SchematicsException(`Could not find (${path})`);
  }
  const content = configBuffer.toString();

  return {
    path,
    workspace: parseJson(
      content,
      JsonParseMode.Loose,
    ) as {} as experimental.workspace.WorkspaceSchema,
  };
}

function updateAppModule(options) {
    return (host, context) => {
        context.logger.debug('Updating appmodule');
        const projectTargets = getProjectTargets(host, options.project);
        if (!projectTargets.build) {
            throw targetBuildNotFoundError();
        }
        const mainPath = projectTargets.build.options.main;
        const modulePath = getAppModulePath(host, mainPath);
        context.logger.debug(`module path: ${modulePath}`);
        // add import
        let moduleSource = getTsSourceFile(host, modulePath);
        let importModule = 'CacheService';
        let importPath = 'src/app/shared/services/cache.service';
        if (!isImported(moduleSource, importModule, importPath)) {
            const change = insertImport(moduleSource, modulePath, importModule, importPath);
            if (change) {
                const recorder = host.beginUpdate(modulePath);
                recorder.insertLeft(change.pos, change.toAdd);
                host.commitUpdate(recorder);
            }
        }

        moduleSource = getTsSourceFile(host, modulePath);
        importModule = 'subscribeSwEvents';
        importPath = 'src/app/shared/services/cache.factory';
        if (!isImported(moduleSource, importModule, importPath)) {
            const change = insertImport(moduleSource, modulePath, importModule, importPath);
            if (change) {
                const recorder = host.beginUpdate(modulePath);
                recorder.insertLeft(change.pos, change.toAdd);
                host.commitUpdate(recorder);
            }
        }

        moduleSource = getTsSourceFile(host, modulePath);
        importModule = 'APP_INITIALIZER, Injector';
        importPath = '@angular/core';
        if (!isImported(moduleSource, importModule, importPath)) {
            const change = insertImport(moduleSource, modulePath, importModule, importPath);
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
        const metadataChanges = addSymbolToNgModuleMetadata(moduleSource, modulePath, 'providers', importText);
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

function getTsSourceFile(host: Tree, path: string): ts.SourceFile {
  const buffer = host.read(path);
  if (!buffer) {
    throw new SchematicsException(`Could not read file (${path}).`);
  }
  const content = buffer.toString();
  const source = ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);

  return source;
}

export function cacheHandler(options: PwaOptions): Rule {
  return (host: Tree) => {
    if (!options.title) {
      options.title = options.project;
    }
    const {path: workspacePath, workspace } = getWorkspace(host);

    if (!options.project) {
      throw new SchematicsException('Option "project" is required.');
    }

    const project = workspace.projects[options.project];
    if (!project) {
      throw new SchematicsException(`Project is not defined in this workspace.`);
    }

    if (project.projectType !== 'application') {
      throw new SchematicsException(`PWA requires a project type of "application".`);
    }

    // Find all the relevant targets for the project
    const projectTargets = project.targets || project.architect;
    if (!projectTargets || Object.keys(projectTargets).length === 0) {
      throw new SchematicsException(`Targets are not defined for this project.`);
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
      } else if (target.builder === '@angular-devkit/build-angular:karma') {
        testTargets.push(target);
      }
    }
    // Setup sources for the assets files to add to the project
    const sourcePath = join(normalize(project.root), 'src/app/shared/services');
    const rootTemplateSource = apply(url('./files'), [
      template({ ...options }),
      move(getSystemPath(sourcePath)),
    ]);

    // Setup service worker schematic options
    const swOptions = { ...options };
    delete swOptions.title;

    // Chain the rules and return
    return chain([
      mergeWith(rootTemplateSource),
      updateAppModule(options)
    ]);
  };
}
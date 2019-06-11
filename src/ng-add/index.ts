import { chain, Rule, schematic, SchematicContext, Tree, } from '@angular-devkit/schematics';
import { Schema as ServiceWorkerOptions } from '../cache-handler/schema';


export default function (options: ServiceWorkerOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    return chain([
      schematic('cache-handler', options)
    ])(host, context);
  };
}
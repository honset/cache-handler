"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
function default_1(options) {
    return (host, context) => {
        return schematics_1.chain([
            schematics_1.schematic('cache-handler', options)
        ])(host, context);
    };
}
exports.default = default_1;
//# sourceMappingURL=index.js.map
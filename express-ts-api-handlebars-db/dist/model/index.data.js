"use strict";
//ré-exportations de micro modules:
//un seul "macro-module" à réimporter
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
//INDEX of DATA  interfaces,classes of entities (for persistence)
__export(require("./devise"));
//export *  from './xxx';
//export *  from './yyy';

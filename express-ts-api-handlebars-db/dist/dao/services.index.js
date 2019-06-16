"use strict";
//ré-exportations de micro modules:
//un seul "macro-module" à réimporter
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
//INDEX of INTERNAL-SERVICES (to exposed by public or private REST api)
__export(require("./devise.service"));
//export *  from './xxx.service';
//export *  from './yyy.service';

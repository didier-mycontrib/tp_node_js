"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Devise = /** @class */ (function () {
    function Devise(code, nom, change) {
        if (code === void 0) { code = "?"; }
        if (nom === void 0) { nom = "?"; }
        if (change === void 0) { change = 0; }
        this.code = code;
        this.nom = nom;
        this.change = change;
    }
    return Devise;
}());
exports.Devise = Devise;

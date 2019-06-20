"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//exemples: ("USD" , "dollar" , 1) ,  ("EUR" , "euro" , 0.9)
//real class for instanciation ,  with constructor .
var DeviseObject = /** @class */ (function () {
    function DeviseObject(code, monnaie, tauxChange) {
        if (code === void 0) { code = "?"; }
        if (monnaie === void 0) { monnaie = "?"; }
        if (tauxChange === void 0) { tauxChange = 0; }
        this.code = code;
        this.monnaie = monnaie;
        this.tauxChange = tauxChange;
    }
    return DeviseObject;
}());
exports.DeviseObject = DeviseObject;

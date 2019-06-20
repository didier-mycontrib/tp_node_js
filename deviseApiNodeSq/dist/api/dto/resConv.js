"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ResConv = /** @class */ (function () {
    function ResConv(montant, source, cible, montantConverti) {
        if (montant === void 0) { montant = 1; }
        if (source === void 0) { source = "EUR"; }
        if (cible === void 0) { cible = "EUR"; }
        if (montantConverti === void 0) { montantConverti = 1; }
        this.montant = montant;
        this.source = source;
        this.cible = cible;
        this.montantConverti = montantConverti;
    }
    return ResConv;
}());
exports.ResConv = ResConv;

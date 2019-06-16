"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AutoIdHelper {
    constructor(idPropName = "id") {
        this.idPropName = idPropName;
    }
    extractId(e) {
        return Reflect.get(this, this.idPropName);
    }
    isAuto() { return true; }
    ;
}
exports.AutoIdHelper = AutoIdHelper;
class StaticIdHelper {
    constructor(idPropName = "id") {
        this.idPropName = idPropName;
    }
    extractId(e) {
        return Reflect.get(this, this.idPropName);
    }
    isAuto() { return false; }
    ;
}
exports.StaticIdHelper = StaticIdHelper;

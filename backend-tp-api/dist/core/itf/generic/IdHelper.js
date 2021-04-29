"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticIdHelper = exports.Auto_IdHelper = exports.AutoIdHelper = void 0;
class AbstractIdHelper {
    constructor(idPropName, auto, defaultInitialValue) {
        this.idPropName = idPropName;
        this.auto = auto;
        this.defaultInitialValue = defaultInitialValue;
    }
    extractId(e) {
        return Reflect.get(e, this.idPropName);
    }
    setId(e, id) {
        Reflect.set(e, this.idPropName, id);
    }
    isAuto() {
        return this.auto;
    }
    getIdPropName() {
        return this.idPropName;
    }
    getDefaultInitialValue() {
        return this.defaultInitialValue;
    }
}
class AutoIdHelper extends AbstractIdHelper {
    constructor(idPropName = "id", defaultInitialValue = undefined) {
        super(idPropName, true, defaultInitialValue);
    }
}
exports.AutoIdHelper = AutoIdHelper;
class Auto_IdHelper extends AbstractIdHelper {
    constructor(idPropName = "_id", defaultInitialValue = undefined) {
        super(idPropName, true, defaultInitialValue);
    }
}
exports.Auto_IdHelper = Auto_IdHelper;
class StaticIdHelper extends AbstractIdHelper {
    constructor(idPropName = "id", defaultInitialValue = undefined) {
        super(idPropName, false, defaultInitialValue);
    }
}
exports.StaticIdHelper = StaticIdHelper;

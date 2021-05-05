"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticIdHelper = exports.Auto_IdHelper = exports.AutoIdHelper = void 0;
//si _id interne et id ou code ou ref en vision externe (ex: alias mongoose)
//alors recherche interne se _id interne
class AbstractIdHelper {
    constructor(idPropName, auto, internalIdPropName = idPropName, defaultInitialValue = undefined) {
        this.idPropName = idPropName;
        this.auto = auto;
        this.internalIdPropName = internalIdPropName;
        this.defaultInitialValue = defaultInitialValue;
    }
    getInternalIdPropName() {
        return this.internalIdPropName;
    }
    extractId(e) {
        return Reflect.get(e, this.idPropName);
    }
    setInternalId(e, id) {
        Reflect.set(e, this.internalIdPropName, id);
    }
    extractInternalId(e) {
        return Reflect.get(e, this.internalIdPropName);
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
    constructor(idPropName = "id", internalIdPropName = idPropName, defaultInitialValue = undefined) {
        super(idPropName, true, internalIdPropName, defaultInitialValue);
    }
}
exports.AutoIdHelper = AutoIdHelper;
class Auto_IdHelper extends AbstractIdHelper {
    constructor(idPropName = "_id", internalIdPropName = idPropName, defaultInitialValue = undefined) {
        super(idPropName, true, internalIdPropName, defaultInitialValue);
    }
}
exports.Auto_IdHelper = Auto_IdHelper;
class StaticIdHelper extends AbstractIdHelper {
    constructor(idPropName = "id", internalIdPropName = idPropName, defaultInitialValue = undefined) {
        super(idPropName, false, internalIdPropName, defaultInitialValue);
    }
}
exports.StaticIdHelper = StaticIdHelper;

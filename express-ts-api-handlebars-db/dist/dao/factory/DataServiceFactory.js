"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TargetEnv;
(function (TargetEnv) {
    TargetEnv[TargetEnv["SIMPLE_TEST"] = 0] = "SIMPLE_TEST";
    TargetEnv[TargetEnv["REAL_TEST"] = 1] = "REAL_TEST";
    TargetEnv[TargetEnv["PROD"] = 2] = "PROD";
})(TargetEnv = exports.TargetEnv || (exports.TargetEnv = {}));
;
var DaoImplType;
(function (DaoImplType) {
    DaoImplType[DaoImplType["MEMORY_MAP"] = 0] = "MEMORY_MAP";
    DaoImplType[DaoImplType["SEQUELIZE_ORM"] = 1] = "SEQUELIZE_ORM";
    DaoImplType[DaoImplType["MONGO_DB"] = 2] = "MONGO_DB";
    DaoImplType[DaoImplType["OTHER"] = 3] = "OTHER";
})(DaoImplType = exports.DaoImplType || (exports.DaoImplType = {}));
;

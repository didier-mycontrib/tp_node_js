"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataServiceFactory_1 = require("./DataServiceFactory");
const MemDeviseDataService_1 = require("../mem/MemDeviseDataService");
const SqDeviseService_1 = require("../sequelize/SqDeviseService");
class DeviseDataServiceFactory {
    dataServiceForTargetEnv(targetEnv) {
        switch (targetEnv) {
            case DataServiceFactory_1.TargetEnv.SIMPLE_TEST:
                return new MemDeviseDataService_1.MemDeviseService();
            case DataServiceFactory_1.TargetEnv.REAL_TEST:
            case DataServiceFactory_1.TargetEnv.PROD:
                return new SqDeviseService_1.SqDeviseService();
        }
    }
    dataServiceByImpl(daoImplType) {
        switch (daoImplType) {
            case DataServiceFactory_1.DaoImplType.MEMORY_MAP:
                return new MemDeviseDataService_1.MemDeviseService();
            case DataServiceFactory_1.DaoImplType.SEQUELIZE_ORM:
                return new SqDeviseService_1.SqDeviseService();
            default:
                throw new Error("DeviseDataService not implemented");
        }
    }
}
exports.DeviseDataServiceFactory = DeviseDataServiceFactory;

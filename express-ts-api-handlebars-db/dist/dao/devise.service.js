"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DeviseDataServiceFactory_1 = require("./factory/DeviseDataServiceFactory");
const default_env_1 = require("./default.env");
exports.deviseDataServiceFactory = new DeviseDataServiceFactory_1.DeviseDataServiceFactory();
exports.deviseDataService = exports.deviseDataServiceFactory.dataServiceForTargetEnv(default_env_1.defaultTargetEnv);

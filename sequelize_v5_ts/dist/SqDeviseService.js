"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GenericSequelizeDataService_1 = require("./GenericSequelizeDataService");
const global_db_model_1 = require("./global-db-model");
class SqDeviseService extends GenericSequelizeDataService_1.GenericSequelizeDataService {
    constructor() {
        super(global_db_model_1.models.devises);
    }
}
exports.SqDeviseService = SqDeviseService;

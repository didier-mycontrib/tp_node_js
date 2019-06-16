"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global_db_model_1 = require("./global-db-model");
//require "strictNullChecks": false in tsconfig.json
// Sequalize implementation of DeviseDataService 
class MySequelizeHelper {
    findByIdInModel(id, model) {
        return new Promise((resolve, reject) => {
            let pk = id;
            model.findByPk(pk)
                .then((obj) => {
                resolve(obj);
            }).catch((error) => {
                reject(error);
            });
        });
    }
}
class SqDeviseService {
    constructor() {
        this.mySequelizeHelper = new MySequelizeHelper();
    }
    findById(id) {
        return this.mySequelizeHelper.findByIdInModel(id, global_db_model_1.models.devises);
    }
    findAll() {
        return new Promise((resolve, reject) => {
            global_db_model_1.models.devises.findAll()
                .then((devises) => {
                resolve(devises);
            }).catch((error) => {
                reject(error);
            });
        });
    }
    save(e) {
        throw new Error("Method not implemented.");
    }
    insert(e) {
        return new Promise((resolve, reject) => {
            global_db_model_1.models.devises.create(e)
                .then((dev) => {
                console.log("dev:" + JSON.stringify(dev));
                resolve(dev /*dev.dataValues*/);
            }).catch((error) => {
                console.log("err:" + JSON.stringify(error));
                reject(error);
            });
        });
    }
    update(e) {
        throw new Error("Method not implemented.");
    }
    deleteById(id) {
        throw new Error("Method not implemented.");
    }
}
exports.SqDeviseService = SqDeviseService;

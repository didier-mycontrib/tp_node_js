"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sq_devise_1 = require("./sq-devise");
const db_config_1 = require("./db-config");
const sq_user_1 = require("./sq-user");
const sq_pays_1 = require("./sq-pays");
// with "strictPropertyInitialization": false in tsconfig.json
class MyApiModels {
}
exports.MyApiModels = MyApiModels;
class MySqDatabase {
    constructor() {
        this.dbname = "unknown";
        this.models = new MyApiModels();
        let model;
        let sqOptions = {
            dialect: db_config_1.confDb.dialect,
            port: db_config_1.confDb.port,
            logging: /*console.log*/ false,
            define: {
                timestamps: false
            }
        };
        var password = db_config_1.confDb.password ? db_config_1.confDb.password : "";
        this.sequelize = new sequelize_1.Sequelize(db_config_1.confDb.database, db_config_1.confDb.user, password, sqOptions);
        this.dbname = db_config_1.confDb.database;
        this.models.devises = sq_devise_1.initDeviseModel(this.sequelize);
        this.models.users = sq_user_1.initUserModel(this.sequelize);
        this.models.pays = sq_pays_1.initPaysModel(this.sequelize);
        this.models.devises.hasMany(this.models.pays);
    }
    getModels() {
        return this.models;
    }
    getSequelize() {
        return this.sequelize;
    }
}
exports.MySqDatabase = MySqDatabase;
exports.database = new MySqDatabase();
exports.models = exports.database.getModels();
exports.sequelize = exports.database.getSequelize();

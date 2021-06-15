"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySequelizeConnection = void 0;
const db_config_1 = require("./db-config");
const my_db_connection_1 = require("./my-db-connection");
const sequelize_1 = require("sequelize");
const sqModels_1 = require("../model/sequelize-model/sqModels");
class MySequelizeConnection extends my_db_connection_1.MyAbstractDbConnection {
    constructor(connexionName) {
        super(connexionName);
        this.dbName = null; // "test" , "admin" , "db1" , ...
        this.username = null;
        this.password = null;
        this.sqOptions = null;
        this.sequelize = null;
        let dbCfg = db_config_1.confDbMap[connexionName];
        this.sqOptions = {
            dialect: dbCfg.dialect,
            port: dbCfg.port,
            host: dbCfg.host,
            logging: /*console.log*/ false,
            define: {
                timestamps: false
            },
            operatorsAliases: { $gte: sequelize_1.Op.gte, $gt: sequelize_1.Op.gt, $lte: sequelize_1.Op.lte, $lt: sequelize_1.Op.lt }
        };
        this.password = dbCfg.password ? dbCfg.password : "";
        this.username = dbCfg.user;
        this.dbName = dbCfg.database;
        this.dbName = dbCfg.database;
        //openConnection(); should be called AFTER (Promise)
    }
    modelsMap() {
        return this.sqModelsMap;
    }
    getModel(name) {
        return this.sqModelsMap.get(name);
    }
    openConnection() {
        console.log("MySequelizeConnection, trying openConnection with dbName=" + this.dbName);
        return new Promise((resolve, reject) => {
            if (this.initialized)
                resolve("sequelize connection already initialized");
            else {
                this.sequelize = new sequelize_1.Sequelize(this.dbName, this.username, this.password, this.sqOptions);
                sqModels_1.sqModels.initModels(this.getName(), this.sequelize);
                this.sqModelsMap = sqModels_1.sqModels.modelsMapForConnection(this.getName());
                /*
                if(this.sequelize == null){
                        reject("sequelize connection fail");
                    }else{
                        this.initialized=true;
                        resolve("sequelize connection succeed");
                    }*/
                this.sequelize.sync({ logging: console.log })
                    .then(() => {
                    console.log("sequelize is initialized");
                    this.initialized = true;
                    resolve("sequelize connection succeed");
                }).catch((err) => {
                    console.log('An error occurred :', JSON.stringify(err));
                    reject("sequelize connection fail");
                });
            }
        });
    }
    closeConnection() {
        return new Promise((resolve, reject) => {
            this.sequelize.close();
            resolve();
        });
    }
    currentDb() {
        return this.sequelize;
    }
    currentConnection() {
        return this.currentDb();
    }
}
exports.MySequelizeConnection = MySequelizeConnection;

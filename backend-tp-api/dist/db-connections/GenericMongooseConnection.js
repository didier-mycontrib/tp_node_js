"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyMongooseConnection = void 0;
const tslib_1 = require("tslib");
const db_config_1 = require("./db-config");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const my_db_connection_1 = require("./my-db-connection");
const mongooseModels_1 = require("../model/mongoose-model/mongooseModels");
class MyMongooseConnection extends my_db_connection_1.MyAbstractDbConnection {
    constructor(connexionName) {
        super(connexionName);
        this.dbUrl = null;
        this.cnx = null;
        this.host = null; //"localhost" or ...
        this.port = null; //27017 ou ...
        this.dbName = null; // "test" , "admin" , "db1" , ...
        this.username = null;
        this.password = null;
        let dbCfg = db_config_1.confDbMap[connexionName];
        this.host = dbCfg.host;
        this.port = dbCfg.port;
        this.dbName = dbCfg.database;
        this.username = dbCfg.user;
        this.password = dbCfg.password;
        let optionalAuthUrlPart = "";
        if (this.username != null && this.password != null) {
            optionalAuthUrlPart = `${this.username}:${this.password}@`;
        }
        this.dbUrl = `mongodb://${optionalAuthUrlPart}${this.host}:${this.port}/${this.dbName}`;
        //openConnection(); should be called AFTER (Promise)
    }
    modelsMap() {
        return this.mModelsMap;
    }
    getModel(name) {
        return this.mModelsMap.get(name);
    }
    openConnection() {
        console.log("MyMongooseConnection, trying openConnection with dbUrl=" + this.dbUrl);
        return new Promise((resolve, reject) => {
            if (this.initialized)
                resolve("mongodb connection already initialized");
            else {
                //if just only one mongoose connection:
                //mongoose.connect(this.dbUrl, {useNewUrlParser: true, useUnifiedTopology: true});
                //this.cnx = mongoose.connection;
                mongoose_1.default.createConnection(this.dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
                    .then((cn) => {
                    this.cnx = cn;
                    this.initialized = true;
                    mongooseModels_1.mongooseModels.initModels(this.getName(), this.cnx);
                    this.mModelsMap = mongooseModels_1.mongooseModels.modelsMapForConnection(this.getName());
                    resolve("mongoose connection succeed");
                })
                    .catch((error) => { reject("mongoose connection fail"); });
            }
        });
    }
    closeConnection() {
        return this.cnx.close();
    }
    currentDb() {
        return this.cnx;
    }
    currentConnection() {
        return this.currentDb();
    }
}
exports.MyMongooseConnection = MyMongooseConnection;

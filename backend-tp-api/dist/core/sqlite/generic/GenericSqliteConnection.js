"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySqliteConnection = void 0;
const tslib_1 = require("tslib");
const db_config_1 = require("../../db-config");
const my_db_connection_1 = require("../../my-db-connection");
const sqlite = tslib_1.__importStar(require("sqlite3"));
const sqlite3 = sqlite.verbose();
class MySqliteConnection extends my_db_connection_1.MyAbstractDbConnection {
    constructor(connexionName) {
        super(connexionName);
        this.dbName = null; // "test" , "admin" , "db1" , ...
        let dbCfg = db_config_1.confDbMap[connexionName];
        this.dbName = dbCfg.database;
        //openConnection(); should be called AFTER (Promise)
    }
    openConnection() {
        console.log("MySqliteConnection, trying openConnection with dbName=" + this.dbName);
        return new Promise((resolve, reject) => {
            if (this.initialized)
                resolve("sqlite connection already initialized");
            else {
                this.db = new sqlite3.Database(this.dbName, (err) => {
                    if (err != null) {
                        this.db = null;
                        reject("sqlite connection fail");
                    }
                    else {
                        this.initialized = true;
                        resolve("sqlite connection succeed");
                    }
                });
            }
        });
    }
    closeConnection() {
        return new Promise((resolve, reject) => {
            this.db.close();
            resolve();
        });
    }
    currentDb() {
        return this.db;
    }
    currentConnection() {
        return this.currentDb();
    }
}
exports.MySqliteConnection = MySqliteConnection;

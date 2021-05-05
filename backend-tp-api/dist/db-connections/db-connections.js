"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.myAppConnectionMap = exports.MyAppConnectionMap = void 0;
const my_db_connection_1 = require("./my-db-connection");
const GenericSequelizeConnection_1 = require("./GenericSequelizeConnection");
const GenericMongooseConnection_1 = require("./GenericMongooseConnection");
class MyAppConnectionMap extends my_db_connection_1.MyAbstractConnectionMap {
    constructor() {
        super();
        this.addConnection(new GenericSequelizeConnection_1.MySequelizeConnection("sq-test"));
        this.addConnection(new GenericMongooseConnection_1.MyMongooseConnection("mongoose-test"));
    }
    async initConnections() {
        try {
            for (let [name, cn] of this.connectionMap) {
                let connectionMessage = await cn.openConnection();
                console.log("connection " + name + " is ok:" + connectionMessage);
            }
            return true;
        }
        catch (err) {
            console.log("connection error:" + err);
            throw err;
        }
    }
}
exports.MyAppConnectionMap = MyAppConnectionMap;
exports.myAppConnectionMap = new MyAppConnectionMap();

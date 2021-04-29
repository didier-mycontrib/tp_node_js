"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqliteDeviseService = void 0;
const tslib_1 = require("tslib");
const GenericSqliteDataService_1 = require("./generic/GenericSqliteDataService");
const devise_1 = require("../../model/devise");
const IdHelper_1 = require("../itf/generic/IdHelper");
const sqlite = tslib_1.__importStar(require("sqlite3"));
const sqlite3 = sqlite.verbose();
// Sqlite implementation of DeviseDataService 
class SqliteDeviseService extends GenericSqliteDataService_1.GenericSqliteDataService {
    constructor() {
        super("sqlite-test", "devise", new IdHelper_1.StaticIdHelper("code"));
        this.initDeviseTableInDb(() => {
            this.saveOrUpdate(new devise_1.DeviseObject("USD", "Dollar", 1));
            this.saveOrUpdate(new devise_1.DeviseObject("EUR", "Euro", 0.91));
            this.saveOrUpdate(new devise_1.DeviseObject("GBP", "Livre", 0.81));
            this.saveOrUpdate(new devise_1.DeviseObject("JPY", "Yen", 132.01));
        });
    }
    initDeviseTableInDb(postInitCallback) {
        this.dB().then((db) => {
            db.serialize(function () {
                // Devise_ID INTEGER PRIMARY KEY  not used here (no autoincr)
                db.run(`CREATE TABLE if not exists devise 
                       (code VARCHAR(12) PRIMARY KEY, 
                       name VARCHAR(64) NOT NULL , 
                       change DOUBLE)`);
                postInitCallback();
            }); //end of db.serialize
        }); //end of this.dB().then ( (db)=> {
    }
}
exports.SqliteDeviseService = SqliteDeviseService;

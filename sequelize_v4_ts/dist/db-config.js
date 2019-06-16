"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var env = "dev"; //or "prod"
exports.confDb = require('./database.cfg.json')[env];
if (exports.confDb.port === undefined) {
    if (exports.confDb.dialect == "mysql") {
        exports.confDb.port = 3306;
    }
}

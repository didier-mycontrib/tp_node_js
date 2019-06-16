"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_config_1 = require("../../config/db-config");
// initialize database connection
exports.sequelize = new sequelize_1.Sequelize(db_config_1.confDb.database, db_config_1.confDb.user, db_config_1.confDb.password, {
    dialect: db_config_1.confDb.dialect,
    port: db_config_1.confDb.port,
    logging: false,
    define: {
        timestamps: false
    }
});
exports.sequelize.authenticate()
    .then((cn) => {
    console.log('Connection has been established successfully.');
}, (err) => {
    console.log('Unable to connect to the database:', err);
});

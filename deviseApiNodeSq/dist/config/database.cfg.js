"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    "dev": {
        "dialect": "mysql",
        "host": "localhost",
        "port": 3306,
        "database": "deviseApiDb",
        "user": "root",
        "password": "root"
    },
    "prod": {
        "dialect": "mysql",
        "host": "devise.db.service",
        "port": 3306,
        "database": "deviseApiDb",
        "user": "root",
        "password": "root"
    }
};

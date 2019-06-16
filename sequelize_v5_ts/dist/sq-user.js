"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
function initUserModel(sequelize) {
    const UserDefineModel = sequelize.define('user', {
        id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        firstName: { type: sequelize_1.DataTypes.STRING(64), allowNull: false },
        lastName: { type: sequelize_1.DataTypes.STRING(64), allowNull: false },
        phoneNumber: { type: sequelize_1.DataTypes.STRING(64), allowNull: true },
        email: { type: sequelize_1.DataTypes.STRING(64), allowNull: true },
    }, {
        freezeTableName: true,
    });
    return UserDefineModel;
}
exports.initUserModel = initUserModel;

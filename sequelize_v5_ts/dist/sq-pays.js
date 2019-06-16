"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
function initPaysModel(sequelize) {
    const PaysDefineModel = sequelize.define('pays', {
        idPays: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: sequelize_1.DataTypes.STRING(64), allowNull: false },
        capitale: { type: sequelize_1.DataTypes.STRING(64), allowNull: false }
    }, {
        freezeTableName: true,
    });
    return PaysDefineModel;
}
exports.initPaysModel = initPaysModel;

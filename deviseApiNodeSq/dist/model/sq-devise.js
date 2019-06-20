"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = require("sequelize");
function initDeviseModel(sequelize) {
    var DeviseDefineModel = sequelize.define('devise', {
        code: { type: sequelize_1.DataTypes.STRING(32), autoIncrement: false, primaryKey: true },
        monnaie: { type: sequelize_1.DataTypes.STRING(64), allowNull: false },
        tauxChange: { type: sequelize_1.DataTypes.DOUBLE, allowNull: false }
    }, {
        freezeTableName: true,
    });
    return DeviseDefineModel;
}
exports.initDeviseModel = initDeviseModel;

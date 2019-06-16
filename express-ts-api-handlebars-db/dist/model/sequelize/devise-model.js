"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//NB: sequelize.import('./xyz-model');
//need an exported function with (sequelize: Sequelize, DataTypes: DataTypes) params
//and returning created/defined model
module.exports =
    function exportDeviseModel(sequelize, DataTypes) {
        let deviseModel = sequelize.define('devise', {
            code: { type: DataTypes.STRING(32), autoIncrement: false, primaryKey: true },
            name: { type: DataTypes.STRING(64), allowNull: false },
            change: { type: DataTypes.DOUBLE, allowNull: false },
        }, {
            freezeTableName: true
        });
        return deviseModel;
    };

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//exemples: ("USD" , "dollar" , 1) ,  ("EUR" , "euro" , 0.9)
//real class for instanciation ,  with constructor .
class DeviseObject {
    constructor(code = "?", name = "?", change = 0) {
        this.code = code;
        this.name = name;
        this.change = change;
    }
}
exports.DeviseObject = DeviseObject;
// ou bien export type DeviseInstance = Instance<DeviseAttributes> & DeviseAttributes;
function deviseModelFactory(sequelize, DataTypes) {
    let deviseModel = sequelize.define('devise', {
        code: { type: DataTypes.STRING(32), autoIncrement: false, primaryKey: true },
        name: { type: DataTypes.STRING(64), allowNull: false },
        change: { type: DataTypes.DOUBLE, allowNull: false },
    }, {
        freezeTableName: true
    });
    return deviseModel;
}
exports.deviseModelFactory = deviseModelFactory;

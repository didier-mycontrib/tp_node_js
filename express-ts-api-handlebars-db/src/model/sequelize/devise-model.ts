//import { sequelize } from './sequelize-instance';
import { DataTypes , Sequelize } from 'sequelize';

//import { Devise } from '../devise';
import { DeviseInstance, } from './dev-sq-itf';
import { DeviseAttributes } from '../devise';


//NB: sequelize.import('./xyz-model');
//need an exported function with (sequelize: Sequelize, DataTypes: DataTypes) params
//and returning created/defined model
module.exports = 
function exportDeviseModel(sequelize: Sequelize, DataTypes: DataTypes) {

    let deviseModel = sequelize.define<DeviseInstance, DeviseAttributes>('devise', {
        code: {type: DataTypes.STRING(32), autoIncrement: false, primaryKey: true},
        name: { type: DataTypes.STRING(64),allowNull: false 	},
        change: { type: DataTypes.DOUBLE,allowNull: false  	},
        }, {   
        freezeTableName: true 
        }
    ); 
    return deviseModel;
}



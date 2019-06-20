import { Devise } from './devise';

import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';
//import { HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyHasAssociationMixin, Association, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin } from '../../lib/associations';

// We need to declare an interface for our model that is basically what our class would be
export interface /*DeviseModel*/ SqDevise extends Model, Devise {
 }
 
 // Need to declare the static model so `findOne` etc. use correct types.
 export type DeviseModelStatic = typeof Model & {
   new (values?: object, options?: BuildOptions): SqDevise /*DeviseModel*/;
 }
 
 export function initDeviseModel(sequelize: Sequelize):DeviseModelStatic{
 const DeviseDefineModel = <DeviseModelStatic> sequelize.define('devise', {
      code: {type: DataTypes.STRING(32), autoIncrement: false, primaryKey: true},
      monnaie: { type: DataTypes.STRING(64),allowNull: false 	},
      tauxChange: { type: DataTypes.DOUBLE,allowNull: false  	}
      }, {   
      freezeTableName: true ,
 });
 return DeviseDefineModel;
}


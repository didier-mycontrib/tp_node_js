import { Devise } from './devise';
import { Pays } from './pays';
import { HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyHasAssociationMixin, Association, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin } from 'sequelize';


import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';
//import { HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyHasAssociationMixin, Association, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin } from '../../lib/associations';

// We need to declare an interface for our model that is basically what our class would be
export interface /*DeviseModel*/ SqDevise extends Model, Devise {

  getPays: HasManyGetAssociationsMixin<Pays>; 
  addPays: HasManyAddAssociationMixin<Pays, number>;
  hasPays: HasManyHasAssociationMixin<Pays, number>;
  countPays: HasManyCountAssociationsMixin;

 }
 
 // Need to declare the static model so `findOne` etc. use correct types.
 export type DeviseModelStatic = typeof Model & {
   new (values?: object, options?: BuildOptions): SqDevise /*DeviseModel*/;
 }
 
 export function initDeviseModel(sequelize: Sequelize):DeviseModelStatic{
 const DeviseDefineModel = <DeviseModelStatic> sequelize.define('devise', {
      code: {type: DataTypes.STRING(32), autoIncrement: false, primaryKey: true},
      name: { type: DataTypes.STRING(64),allowNull: false 	},
      change: { type: DataTypes.DOUBLE,allowNull: false  	}
      }, {   
      freezeTableName: true ,
 });
 return DeviseDefineModel;
}


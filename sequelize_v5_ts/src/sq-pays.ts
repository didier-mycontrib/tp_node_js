import { Pays } from './pays';

import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';
//import { HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyHasAssociationMixin, Association, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin } from '../../lib/associations';

// We need to declare an interface for our model that is basically what our class would be
export interface /*PaysModel*/ SqPays extends Model, Pays {
 }
 
 // Need to declare the static model so `findOne` etc. use correct types.
 export type PaysModelStatic = typeof Model & {
   new (values?: object, options?: BuildOptions): SqPays /*PaysModel*/;
 }
 
 export function initPaysModel(sequelize: Sequelize):PaysModelStatic{
 const PaysDefineModel = <PaysModelStatic> sequelize.define('pays', {
      idPays: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
      name: { type: DataTypes.STRING(64),allowNull: false 	},
      capitale: { type: DataTypes.STRING(64),allowNull: false  	}
      }, {   
      freezeTableName: true ,
 });
 return PaysDefineModel;
}


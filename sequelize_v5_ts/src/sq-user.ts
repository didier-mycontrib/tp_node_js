import { User } from './user';

import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';
//import { HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyHasAssociationMixin, Association, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin } from '../../lib/associations';

// We need to declare an interface for our model that is basically what our class would be
export interface /*UserModel*/ SqUser extends Model, User {
 }
 
 // Need to declare the static model so `findOne` etc. use correct types.
 export type UserModelStatic = typeof Model & {
   new (values?: object, options?: BuildOptions): SqUser /*UserModel*/;
 }
 
 export function initUserModel(sequelize: Sequelize):UserModelStatic{
 const UserDefineModel = <UserModelStatic> sequelize.define('user', {
      id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
      firstName: { type: DataTypes.STRING(64),allowNull: false 	},
      lastName: { type: DataTypes.STRING(64),allowNull: false 	},
      phoneNumber: { type: DataTypes.STRING(64),allowNull: true 	},
      email: { type: DataTypes.STRING(64),allowNull: true 	},
      }, {   
      freezeTableName: true ,
 });
 return UserDefineModel;
}


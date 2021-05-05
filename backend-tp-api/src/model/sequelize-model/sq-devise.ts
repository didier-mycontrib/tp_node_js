import { Devise } from '../devise';
import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';
/* import { HasManyGetAssociationsMixin, HasManyAddAssociationMixin,
HasManyHasAssociationMixin, Association, HasManyCountAssociationsMixin,
HasManyCreateAssociationMixin } from 'sequelize'; */

//SqDevise est une interface mixant la structure de données "Devise" au "Model" Sequelize :
export interface /*DeviseModel*/ SqDevise extends Model, Devise {
}
// Need to declare the static model so `findOne` etc. use correct types.
export type DeviseModelStatic = typeof Model & {
new (values?: object, options?: BuildOptions): SqDevise /*DeviseModel*/;
}

// fonction exportée (à appeler) définissant la structure de la table (dans base de données) :
export function initDeviseModel(sequelize: Sequelize):DeviseModelStatic{
const DeviseDefineModel = <DeviseModelStatic> sequelize.define('devise', {
    code: {type: DataTypes.STRING(32), autoIncrement: false, primaryKey: true},
    name: { type: DataTypes.STRING(64),allowNull: false },
    change: { type: DataTypes.DOUBLE,allowNull: false }
    }, 
    { freezeTableName: true , });
return DeviseDefineModel;
}
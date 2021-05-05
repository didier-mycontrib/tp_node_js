import { Publication } from '../publication';
import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';
/* import { HasManyGetAssociationsMixin, HasManyAddAssociationMixin,
HasManyHasAssociationMixin, Association, HasManyCountAssociationsMixin,
HasManyCreateAssociationMixin } from 'sequelize'; */

//SqPublication est une interface mixant la structure de données "Publication" au "Model" Sequelize :
export interface /*PublicationModel*/ SqPublication extends Model, Publication {
}
// Need to declare the static model so `findOne` etc. use correct types.
export type PublicationModelStatic = typeof Model & {
new (values?: object, options?: BuildOptions): SqPublication /*PublicationModel*/;
}

// fonction exportée (à appeler) définissant la structure de la table (dans base de données) :
export function initPublicationModel(sequelize: Sequelize):PublicationModelStatic{
const PublicationDefineModel = <PublicationModelStatic> sequelize.define('publication', {
    /*_id : {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4,
           allowNull: false, primaryKey: true},*/
    _id : {type: DataTypes.INTEGER, autoIncrement : true, primaryKey: true,
           get() {
            const rawValue = this.getDataValue("_id");
            return rawValue ? rawValue.toString() : null;
              }
           },
    titre: { type: DataTypes.STRING(64),allowNull: false },
    fichier_image_name: { type: DataTypes.STRING(128),allowNull: true },
    resume: { type: DataTypes.STRING(128),allowNull: true },
    texte_complet: { type: DataTypes.STRING(256),allowNull: true },
    date: { type: DataTypes.STRING(32),allowNull: true },
    fichier_details_name: { type: DataTypes.STRING(128),allowNull: true },
    lien_externe: { type: DataTypes.STRING(128),allowNull: true },
    }, 
    { freezeTableName: true , });
return PublicationDefineModel;
}
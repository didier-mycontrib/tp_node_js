"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPublicationModel = void 0;
const sequelize_1 = require("sequelize");
// fonction exportée (à appeler) définissant la structure de la table (dans base de données) :
function initPublicationModel(sequelize) {
    const PublicationDefineModel = sequelize.define('publication', {
        /*_id : {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4,
               allowNull: false, primaryKey: true},*/
        _id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true,
            get() {
                const rawValue = this.getDataValue("_id");
                return rawValue ? rawValue.toString() : null;
            }
        },
        titre: { type: sequelize_1.DataTypes.STRING(64), allowNull: false },
        fichier_image_name: { type: sequelize_1.DataTypes.STRING(128), allowNull: true },
        resume: { type: sequelize_1.DataTypes.STRING(128), allowNull: true },
        texte_complet: { type: sequelize_1.DataTypes.STRING(256), allowNull: true },
        date: { type: sequelize_1.DataTypes.STRING(32), allowNull: true },
        fichier_details_name: { type: sequelize_1.DataTypes.STRING(128), allowNull: true },
        lien_externe: { type: sequelize_1.DataTypes.STRING(128), allowNull: true },
    }, { freezeTableName: true, });
    return PublicationDefineModel;
}
exports.initPublicationModel = initPublicationModel;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPersistentPublicationModel = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const mongooseAutoIncrement = tslib_1.__importStar(require("mongoose-auto-increment"));
const publicationSchema = new mongoose_1.default.Schema({
    _id: { type: String, alias: "id" },
    titre: String,
    fichier_image_name: String,
    resume: String,
    texte_complet: String,
    date: String,
    fichier_details_name: String,
    lien_externe: String
});
publicationSchema.set('id', false); //no default virtual id alias for _id
//==> internal ._id , external ._id
publicationSchema.set('toJSON', { virtuals: false,
    versionKey: false, transform: function (doc, ret) { if (ret._id)
        ret._id = ret._id.toString(); }
});
// fonction exportée (à appeler) définissant la structure de la table (dans base de données) :
function initPersistentPublicationModel(cn) {
    mongooseAutoIncrement.initialize(cn);
    publicationSchema.plugin(mongooseAutoIncrement.plugin, {
        model: 'Publication',
        field: '_id',
        startAt: 1,
        incrementBy: 1
    });
    //"Publication" model name is "publications" collection name in mongoDB test database
    const PersistentPublicationModel = cn.model('Publication', publicationSchema);
    /* of gerenic type mongoose.Model<mongoose.Document<any, {}>, {}>*/
    return PersistentPublicationModel;
}
exports.initPersistentPublicationModel = initPersistentPublicationModel;

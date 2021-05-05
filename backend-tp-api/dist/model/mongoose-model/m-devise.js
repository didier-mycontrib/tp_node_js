"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPersistentDeviseModel = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const deviseSchema = new mongoose_1.default.Schema({
    _id: { type: String, alias: "code" },
    name: String,
    change: Number
});
deviseSchema.set('id', false); //no default virtual id alias for _id
//==> internal ._id , external .code
deviseSchema.set('toJSON', { virtuals: true,
    versionKey: false, transform: function (doc, ret) { delete ret._id; }
});
// fonction exportée (à appeler) définissant la structure de la table (dans base de données) :
function initPersistentDeviseModel(cn) {
    //"Devise" model name is "devises" collection name in mongoDB test database
    const PersistentDeviseModel = cn.model('Devise', deviseSchema);
    /* of gerenic type mongoose.Model<mongoose.Document<any, {}>, {}>*/
    return PersistentDeviseModel;
}
exports.initPersistentDeviseModel = initPersistentDeviseModel;

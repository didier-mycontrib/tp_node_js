import { Devise } from '../devise';
import  mongoose from 'mongoose';

const deviseSchema = new mongoose.Schema({
    _id: { type : String , alias : "code" } ,
    name: String,
    change : Number
    });


deviseSchema.set('id',false); //no default virtual id alias for _id

//==> internal ._id , external .code

deviseSchema.set('toJSON', { virtuals: true ,
    versionKey:false,
    transform: function (doc:any, ret:any) { delete ret._id }
});



//DeviseDoc est une interface mixant la structure de données "Devise" au "Document" Mongoose :
export interface DeviseDoc extends mongoose.Document<Devise>, Devise {
}

export type PersistentDeviseModel = mongoose.Model<DeviseDoc,{}>

// fonction exportée (à appeler) définissant la structure de la table (dans base de données) :
export function initPersistentDeviseModel(cn : mongoose.Connection) : PersistentDeviseModel {
        
    //"Devise" model name is "devises" collection name in mongoDB test database
    const PersistentDeviseModel = cn.model('Devise', deviseSchema);
    /* of gerenic type mongoose.Model<mongoose.Document<any, {}>, {}>*/

    return PersistentDeviseModel as any as PersistentDeviseModel;
}
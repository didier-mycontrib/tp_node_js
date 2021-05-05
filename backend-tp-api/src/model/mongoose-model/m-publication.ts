import { Publication } from '../publication';
import  mongoose from 'mongoose';
import * as mongooseAutoIncrement from 'mongoose-auto-increment';

const publicationSchema = new mongoose.Schema({
    _id: { type : String , alias : "id" } , 
    titre : String,
    fichier_image_name : String,
	resume : String,
	texte_complet : String,
	date : String,
	fichier_details_name : String,
	lien_externe : String
    });


publicationSchema.set('id',false); //no default virtual id alias for _id

//==> internal ._id , external ._id

publicationSchema.set('toJSON', { virtuals: false ,
    versionKey:false ,
    transform: function (doc:any, ret:any) { if(ret._id) ret._id = ret._id.toString();  } 
});

 


//PublicationDoc est une interface mixant (si possible en typescript) la structure de données "Publication" au "Document" Mongoose :
export interface PublicationDoc extends mongoose.Document<Publication>/*, Publication*/ {
}

export type PersistentPublicationModel = mongoose.Model<PublicationDoc,{}>

// fonction exportée (à appeler) définissant la structure de la table (dans base de données) :
export function initPersistentPublicationModel(cn : mongoose.Connection) : PersistentPublicationModel {
    mongooseAutoIncrement.initialize(cn); 
    publicationSchema.plugin(mongooseAutoIncrement.plugin, {
        model: 'Publication',
        field: '_id'  ,
        startAt: 1,
        incrementBy: 1
    });    
    //"Publication" model name is "publications" collection name in mongoDB test database
    const PersistentPublicationModel = cn.model('Publication', publicationSchema);
    /* of gerenic type mongoose.Model<mongoose.Document<any, {}>, {}>*/

    return PersistentPublicationModel as any as PersistentPublicationModel;
}
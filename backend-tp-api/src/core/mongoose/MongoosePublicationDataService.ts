import { PublicationDataService } from "../itf/PublicationDataService";
import { GenericMongooseDataService } from "./generic/GenericMongooseDataService";
import { Publication, PublicationObject  } from "../../model/publication";
import { IdHelper, Auto_IdHelper } from "../itf/generic/IdHelper";
import { PersistentPublicationModel } from '../../model/mongoose-model/m-publication';

// MongoDB implementation of PublicationDataService 

export class MongoosePublicationService 
       extends GenericMongooseDataService<Publication,string>
       implements PublicationDataService {

    private  persistentPublicationModel : PersistentPublicationModel  ;
        //défini dans model/mongoose/m-publication.ts 
        //plus précis que mongooseModel (de la super classe)
        //et à utiliser pour coder les méthodes
        //de recherches spécifiques (non génériques)        

    constructor(){
        super("mongoose-test" , "publication" /* ,  new Auto_IdHelper<Publication,string>("_id") by default */);
        this.initModel()
        .then((model)=> {
            this.persistentPublicationModel = model as any as  PersistentPublicationModel;
            this.initDataSet();
        })
        .catch((error: Error) => { console.log("erreur initialisation MongoosePublicationService") });
}

initDataSet(){
    this.saveOrUpdate( new PublicationObject("1" , "gros horloge rouen(mg)" , "rouen.jpg","rue du gros Horloge" , 
                null,"2019-07-12",null,"https://fr.wikipedia.org/wiki/Gros-Horloge"));
    this.saveOrUpdate( new PublicationObject("2" , "chateau de gaillon(mg)" , "gaillon.jpg","chateau gaillon (renaissance)" , 
                        null,"2019-07-11",null,"https://www.tourisme-seine-eure.com/decouvrir/top-10-pour-visiter/le-chateau-de-gaillon/"));
    this.saveOrUpdate( new PublicationObject("3" , "tour eiffel(mg)" , "tourEiffel.jpg","tour eiffel (Paris)" , 
                        "<p> la <b>Tour Eiffel</b> mesure environ 300 mètres </p>","2019-07-12",null,null));
    this.saveOrUpdate(  new PublicationObject("4" , "Mont Saint Michel(mg)" , "montSaintMichel.jpg","Mont Saint Michel" , 
                        "<p> le <b>Mont Saint Michel</b> change de couleur très fréquemment </p>","2019-07-11",null,null));
  }

}
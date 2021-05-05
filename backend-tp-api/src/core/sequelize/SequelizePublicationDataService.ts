import { PublicationDataService } from "../itf/PublicationDataService";
import { GenericSequelizeDataService } from "./generic/GenericSequelizeDataService";
import { Publication , PublicationObject  } from "../../model/publication";
import { IdHelper, Auto_IdHelper } from "../itf/generic/IdHelper";
import { PublicationModelStatic } from '../../model/sequelize-model/sq-publication';

// NeDB implementation of PublicationDataService 

export class SequelizePublicationService 
       extends GenericSequelizeDataService<Publication,string>
       implements PublicationDataService {

    private  persistentPublicationModel : PublicationModelStatic  ;
        //défini dans model/sequelize/sq-publication.ts 
        //plus précis que sequelizeModel (de la super classe)
        //et à utiliser pour coder les méthodes
        //de recherches spécifiques (non génériques)            

    constructor(){
        super("sq-test" , "publication" ,  new Auto_IdHelper<Publication,string>("_id"));
        this.initModel()
            .then((model)=> {
                this.persistentPublicationModel = model as any as  PublicationModelStatic;
                this.initDataSet();
            })
            .catch((error: Error) => { console.log("erreur initialisation SequelizePublicationService") });
   }

   initDataSet(){
        this.saveOrUpdate( new PublicationObject("1" , "gros horloge rouen(sq)" , "rouen.jpg","rue du gros Horloge" , 
                null,"2019-07-12",null,"https://fr.wikipedia.org/wiki/Gros-Horloge"));
        this.saveOrUpdate( new PublicationObject("2" , "chateau de gaillon(sq)" , "gaillon.jpg","chateau gaillon (renaissance)" , 
                        null,"2019-07-11",null,"https://www.tourisme-seine-eure.com/decouvrir/top-10-pour-visiter/le-chateau-de-gaillon/"));
        this.saveOrUpdate( new PublicationObject("3" , "tour eiffel(sq)" , "tourEiffel.jpg","tour eiffel (Paris)" , 
                        "<p> la <b>Tour Eiffel</b> mesure environ 300 mètres </p>","2019-07-12",null,null));
        this.saveOrUpdate(  new PublicationObject("4" , "Mont Saint Michel(sq)" , "montSaintMichel.jpg","Mont Saint Michel" , 
                        "<p> le <b>Mont Saint Michel</b> change de couleur très fréquemment </p>","2019-07-11",null,null));
    }

}
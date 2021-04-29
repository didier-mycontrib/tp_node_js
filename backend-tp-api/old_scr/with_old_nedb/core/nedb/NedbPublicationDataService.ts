import { PublicationDataService } from "../itf/PublicationDataService";
import { GenericNedbDataService } from "./generic/GenericNedbDataService";
import { Publication , PublicationObject  } from "../../model/publication";
import { IdHelper, StaticIdHelper } from "../itf/generic/IdHelper";

// NeDB implementation of PublicationDataService 

export class NedbPublicationService 
       extends GenericNedbDataService<Publication,string>
       implements PublicationDataService {


    constructor(){
        super("nedb-test" , "publications" /* ,  new Auto_IdHelper<Publication,string>("_id") by default */);
        this.saveOrUpdate( new PublicationObject("1" , "gros horloge rouen(mem)" , "rouen.jpg","rue du gros Horloge" , 
               null,"2019-07-12",null,"https://fr.wikipedia.org/wiki/Gros-Horloge"));
        this.saveOrUpdate( new PublicationObject("2" , "chateau de gaillon(mem)" , "gaillon.jpg","chateau gaillon (renaissance)" , 
                null,"2019-07-11",null,"http://www.passionchateaux.com/ch_gaillon.htm"));
        this.saveOrUpdate( new PublicationObject("3" , "tour eiffel(mem)" , "tourEiffel.jpg","tour eiffel (Paris)" , 
                 "<p> la <b>Tour Eiffel</b> mesure environ 300 mètres </p>","2019-07-12",null,null));
        this.saveOrUpdate(  new PublicationObject("4" , "Mont Saint Michel(mem)" , "montSaintMichel.jpg","Mont Saint Michel" , 
                "<p> le <b>Mont Saint Michel</b> change de couleur très fréquemment </p>","2019-07-11",null,null));
 
    }

}
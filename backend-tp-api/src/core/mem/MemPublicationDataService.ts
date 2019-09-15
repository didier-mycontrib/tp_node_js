import { PublicationDataService } from "../itf/PublicationDataService";
import { GenericMemDataService } from "./generic/GenericMemDataService";
import { Publication , PublicationObject } from "../../model/publication";
import { IdHelper, Auto_IdHelper } from "../itf/generic/IdHelper";

// memory Map implementation of PublicationDataService 

export class MemPublicationService 
       extends GenericMemDataService<Publication,string>
       implements PublicationDataService {

    private publicationIdHelper : IdHelper<Publication,string> = new Auto_IdHelper<Publication,string>();//_id

    constructor(){
        super();
        this.idHelper=this.publicationIdHelper;
        this.dataMap.set("1", new PublicationObject("1" , "gros horloge rouen(mem)" , "rouen.jpg","rue du gros Horloge" , 
                                                null,"2019-07-12",null,"https://fr.wikipedia.org/wiki/Gros-Horloge"));
        this.dataMap.set("2", new PublicationObject("2" , "chateau de gaillon(mem)" , "gaillon.jpg","chateau gaillon (renaissance)" , 
                                                        null,"2019-07-11",null,"http://www.passionchateaux.com/ch_gaillon.htm"));
        this.dataMap.set("3", new PublicationObject("3" , "tour eiffel(mem)" , "tourEiffel.jpg","tour eiffel (Paris)" , 
                                                    "<p> la <b>Tour Eiffel</b> mesure environ 300 mètres </p>","2019-07-12",null,null));
        this.dataMap.set("4", new PublicationObject("4" , "Mont Saint Michel(mem)" , "montSaintMichel.jpg","Mont Saint Michel" , 
                                                    "<p> le <b>Mont Saint Michel</b> change de couleur très fréquemment </p>","2019-07-11",null,null));
        this.initLastId("4");
    /*PublicationObject(_id , titre, fichier_image_name, resume, texte_complet,
                 date,fichier_details_name,lien_externe) 
    */
    }

    

}
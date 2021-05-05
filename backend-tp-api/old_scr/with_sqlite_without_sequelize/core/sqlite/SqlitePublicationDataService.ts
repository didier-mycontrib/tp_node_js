import { PublicationDataService } from "../itf/PublicationDataService";
import { GenericSqliteDataService } from "./generic/GenericSqliteDataService";
import { Publication , PublicationObject  } from "../../model/publication";
import { IdHelper, Auto_IdHelper } from "../itf/generic/IdHelper";

// NeDB implementation of PublicationDataService 

export class SqlitePublicationService 
       extends GenericSqliteDataService<Publication,string>
       implements PublicationDataService {


    constructor(){
        super("sqlite-test" , "publication" ,  new Auto_IdHelper<Publication,string>("_id","_id","1"));
        this.initPublicationTableInDb(
            ()=>{
                this.saveOrUpdate( new PublicationObject("1" , "gros horloge rouen(mem)" , "rouen.jpg","rue du gros Horloge" , 
                null,"2019-07-12",null,"https://fr.wikipedia.org/wiki/Gros-Horloge"));
                this.saveOrUpdate( new PublicationObject("2" , "chateau de gaillon(mem)" , "gaillon.jpg","chateau gaillon (renaissance)" , 
                        null,"2019-07-11",null,"https://www.tourisme-seine-eure.com/decouvrir/top-10-pour-visiter/le-chateau-de-gaillon/"));
                this.saveOrUpdate( new PublicationObject("3" , "tour eiffel(mem)" , "tourEiffel.jpg","tour eiffel (Paris)" , 
                        "<p> la <b>Tour Eiffel</b> mesure environ 300 mètres </p>","2019-07-12",null,null));
                this.saveOrUpdate(  new PublicationObject("4" , "Mont Saint Michel(mem)" , "montSaintMichel.jpg","Mont Saint Michel" , 
                        "<p> le <b>Mont Saint Michel</b> change de couleur très fréquemment </p>","2019-07-11",null,null));
            });
    }

    
    initPublicationTableInDb(postInitCallback: ()=>void){
        this.dB().then ( (db)=> {
          db.serialize(function() {
      
            // id INTEGER PRIMARY KEY used here (autoincr as an alias as rowid)
      
            db.run(`CREATE TABLE if not exists publication 
                       (_id INTEGER PRIMARY KEY, 
                       titre VARCHAR(64) NOT NULL , 
                       fichier_image_name VARCHAR(128) , 
                       resume VARCHAR(128) , 
                       texte_complet VARCHAR(256) ,
                       date VARCHAR(64) ,
                       fichier_details_name VARCHAR(128) ,
                       lien_externe VARCHAR(128))`);
            
            postInitCallback();
          });//end of db.serialize
        });//end of this.dB().then ( (db)=> {
      }


}

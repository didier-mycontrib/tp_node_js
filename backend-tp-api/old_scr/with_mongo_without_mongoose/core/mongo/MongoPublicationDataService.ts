import { PublicationDataService } from "../itf/PublicationDataService";
import { GenericMongoDataService } from "./generic/GenericMongoDataService";
import { Publication  } from "../../model/publication";
import { IdHelper, Auto_IdHelper } from "../itf/generic/IdHelper";

// MongoDB implementation of NewsDataService 

export class MongoPublicationService 
       extends GenericMongoDataService<Publication,string>
       implements PublicationDataService {


    constructor(){
        super("mongo-test" , "pubs" /* ,  new Auto_IdHelper<Publication,string>("_id") by default */);
    }

}
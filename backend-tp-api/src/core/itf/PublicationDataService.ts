import { Publication } from "../../model/publication";
import { BasicCrudService } from "./generic/BasicCrudService";

export interface PublicationDataService extends BasicCrudService<Publication,string>{
    /*
     inherited methods from BasicCrudService:
     insert,update,saveOrUpdate(pub: Publication) : Promise<Publication> ; 
     findById(idPub: string) : Promise<Publication> ;
     deleteById(idPub: string) :Promise<void> ;
     findAll() : Promise<Pub[]> ; 
     */
}

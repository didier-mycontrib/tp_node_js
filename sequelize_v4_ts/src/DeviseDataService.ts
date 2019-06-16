import { Devise } from "./devise";
import { BasicCrudService } from "./BasicCrudService";

export interface DeviseDataService extends BasicCrudService<Devise,string>{
    /*
     inherited methods from BasicCrudService:
     insert,update,save(dev: Devise) : Promise<Devise> ; 
     findById(codeDev: string) : Promise<Devise> ;
     deleteById(codeDev: string) :void ;
     findAll() : Promise<Devise[]> ; 
     */
}

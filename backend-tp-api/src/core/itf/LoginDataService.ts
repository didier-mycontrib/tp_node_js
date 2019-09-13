import { Login } from "../../model/login";
import { BasicCrudService } from "./generic/BasicCrudService";

export interface LoginDataService extends BasicCrudService<Login,string>{
    /*
     inherited methods from BasicCrudService:
     insert,update,saveOrUpdate(l: Login) : Promise<Login> ; 
     findById(username: string) : Promise<Login> ;
     deleteById(username: string) :Promise<void> ;
     findAll() : Promise<Login[]> ; 
     */
}

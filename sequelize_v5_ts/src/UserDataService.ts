import { User } from "./user";
import { BasicCrudService } from "./BasicCrudService";

export interface UserDataService extends BasicCrudService<User,number>{
    /*
     inherited methods from BasicCrudService:
     insert,update,saveOrUpdate(u: User) : Promise<User> ; 
     findById(id: number) : Promise<User> ;
     deleteById(id: number) :Promise<void>  ;
     findAll() : Promise<User[]> ; 
     */
}

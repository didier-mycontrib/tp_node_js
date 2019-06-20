import { Devise } from "../model/devise";

export interface DeviseDataService {
    findById(code : string) : Promise<Devise>; 
    findAll() : Promise<Devise[]>; 
    insert(d:Devise) : Promise<Devise>; 
    update(d:Devise): Promise<Devise>; 
    saveOrUpdate(d:Devise) : Promise<Devise>; 
    deleteById(code:string) :Promise<void> ;
}
/* DeviseDataService pourrait éventuellement hérité de 
export interface BasicCrudService<T,ID>{
    findById(id : ID) : Promise<T>; 
    findAll() : Promise<T[]>; 
    saveOrUpdate(e:T) : Promise<T>; //create/insert or update
    insert(e:T) : Promise<T>; //insert into or add or ...
    update(e:T): Promise<T>; //update
    deleteById(id : ID) :Promise<void> ;
 }
 */
 
 //NB: en cas d'erreur/exception , les promesses rejetees 
 //contiendront un objet ErrorWithStatus (ou une sous classe telle que ErrorWithStatus)
import {DeviseDataService } from './deviseDataService'
import { Devise , DeviseObject } from '../model/devise';
import { NotFoundError, ConflictError } from '../api/apiErrorHandler';


export class MemoryMapDeviseService implements DeviseDataService{
   
    private delay : number = 50 ; //50ms (simulation async)

    private mapDevises = new Map<string,Devise>();

    constructor(){
        //JEUX DE DONNEES INITIAL (TP):
        this.mapDevises.set("EUR",new DeviseObject("EUR" , "euro" , 1));
        this.mapDevises.set("USD",new DeviseObject("USD" , "dollar" , 1.1));
        this.mapDevises.set("GBP",new DeviseObject("GBP" , "livre" , 0.9));
        this.mapDevises.set("JPY",new DeviseObject("JPY" , "yen" , 132));
    }

    findById(code: string): Promise<Devise> {
        return new Promise((resolve,reject) => {
            setTimeout(()=>{
                if(this.mapDevises.has(code)){
                    let deviseObj = this.mapDevises.get(code);
                    resolve(deviseObj);
                }else{
                    reject(new NotFoundError("devise not found (code="+code+")"));
                }
            },this.delay); //simulation attente (async)
        });
    }   

    findAll(): Promise<Devise[]> {
        return new Promise((resolve,reject) => {
            let allDataIterables = this.mapDevises.values();
            let allDataArray = [ ...allDataIterables ];
            resolve(allDataArray);
        });
    }

    insert(d: Devise): Promise<Devise> {
        return new Promise((resolve,reject) => {
            if(this.mapDevises.has(d.code))
               reject(new ConflictError("devise already exist with code="+d.code));
            this.mapDevises.set(d.code,d);
            resolve(d);
         });
    }

    update(d: Devise): Promise<Devise> {
        return new Promise((resolve,reject) => {
            if(!this.mapDevises.has(d.code))
               reject( new NotFoundError("cannot update, devise not found with code="+d.code));
            this.mapDevises.set(d.code,d);
            resolve(d);
         });
    }

    deleteById(code: string): Promise<void> {
        return new Promise((resolve,reject) => {
            if(this.mapDevises.has(code)){
                 this.mapDevises.delete(code);
                 resolve();
            }else{
                reject(new NotFoundError("devise not found for delete with code="+code));
            }
           });
    }

    saveOrUpdate(d: Devise): Promise<Devise> {
        return new Promise((resolve,reject) => {
            this.mapDevises.set(d.code,d);
            resolve(d);
         });
    }


}
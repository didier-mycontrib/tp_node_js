import { DeviseDataService } from "../itf/DeviseDataService";
import { GenericMongooseDataService } from "./generic/GenericMongooseDataService";
import { Devise, DeviseObject  } from "../../model/devise";
import { IdHelper, StaticIdHelper } from "../itf/generic/IdHelper";
import mongoose from 'mongoose';

import { DeviseDoc , PersistentDeviseModel } from "../../model/mongoose-model/m-devise"

// MongoDB implementation of DeviseDataService 

export class MongooseDeviseService 
       extends GenericMongooseDataService<Devise,string>
       implements DeviseDataService {

    private  persistentDeviseModel : PersistentDeviseModel  ;
    //défini dans model/mongoose/m-devise.ts 
    //plus précis que mongooseModel (de la super classe)
    //et à utiliser pour coder les méthodes
    //de recherches spécifiques (non génériques)

    constructor(){
        super("mongoose-test" , "devise" ,  new StaticIdHelper<Devise,string>("code","_id"));
        this.initModel()
            .then((model)=> {
                this.persistentDeviseModel = model as any as  PersistentDeviseModel;
                this.initDataSet();
            })
            .catch((error: Error) => { console.log("erreur initialisation MongooseDeviseService") });
    }

    
    initDataSet(){
        this.saveOrUpdate( new DeviseObject("USD" , "Dollar" , 1));
        this.saveOrUpdate( new DeviseObject("EUR" , "Euro" , 0.91));
        this.saveOrUpdate( new DeviseObject("GBP" , "Livre" , 0.81));
        this.saveOrUpdate( new DeviseObject("JPY" , "Yen" , 132.01));
      }

     // findByChangeMini(changeMini: number): Promise<Devise[]> {
     async  findByChangeMini(changeMini: number): Promise<Devise[]> {
            let query = changeMini?{ change : { $gte : changeMini } }:{};
            return this.persistentDeviseModel.find(query);
    }
}
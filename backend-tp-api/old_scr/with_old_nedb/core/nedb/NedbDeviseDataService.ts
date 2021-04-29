import { DeviseDataService } from "../itf/DeviseDataService";
import { GenericNedbDataService } from "./generic/GenericNedbDataService";
import { Devise , DeviseObject  } from "../../model/devise";
import { IdHelper, StaticIdHelper } from "../itf/generic/IdHelper";

// MongoDB implementation of DeviseDataService 

export class NedbDeviseService 
       extends GenericNedbDataService<Devise,string>
       implements DeviseDataService {


    constructor(){
        super("nedb-test" , "devises" ,  new StaticIdHelper<Devise,string>("code"));
        this.saveOrUpdate(new DeviseObject("USD" , "Dollar" , 1));
        this.saveOrUpdate(new DeviseObject("EUR" , "Euro" , 0.92));
        this.saveOrUpdate(new DeviseObject("GBP" , "Livre" , 0.82));
        this.saveOrUpdate(new DeviseObject("JPY" , "Yen" , 132.02));
    }

}
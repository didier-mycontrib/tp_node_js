import { Devise } from "../../model/devise";
import { DataServiceFactory } from "./DataServiceFactory";

import {TargetEnv , DaoImplType} from "./DataServiceFactory";
import { MemDeviseService } from "../mem/MemDeviseDataService";
import { DeviseDataService } from "../itf/DeviseDataService";
import { SqDeviseService } from "../sequelize/SqDeviseService";

export class DeviseDataServiceFactory implements DataServiceFactory<Devise,string,DeviseDataService> {
    dataServiceForTargetEnv(targetEnv: TargetEnv) {
        switch(targetEnv){
            case TargetEnv.SIMPLE_TEST : 
                return new MemDeviseService();
            case TargetEnv.REAL_TEST : 
            case TargetEnv.PROD :   
                return new SqDeviseService();
        }
    }   
     dataServiceByImpl(daoImplType: DaoImplType) {
        switch(daoImplType){
            case DaoImplType.MEMORY_MAP : 
                return new MemDeviseService();
            case DaoImplType.SEQUELIZE_ORM :  
                return new SqDeviseService(); 
            default:
                 throw new Error("DeviseDataService not implemented");
        }
    }

    
}
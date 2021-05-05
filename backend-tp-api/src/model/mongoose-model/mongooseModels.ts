import mongoose from 'mongoose';
import { initPersistentDeviseModel } from "./m-devise";
import { initPersistentPublicationModel } from './m-publication';

type AnyMongooseModel = mongoose.Model<mongoose.Document<any, {}>, {}>

export class MongooseModels {


    //Map of Maps 
    //Main Map : for each connection-name of type "mongoose"
    //SubMap : <model-name , MongooseModel >
    protected mModelsMapMap : Map<string,Map<string,AnyMongooseModel>> = new Map();

    public modelsMapForConnection(connectionName:string): Map<string,AnyMongooseModel> {
        return this.mModelsMapMap.get(connectionName);
    }

    public  addModel(connectionName:string,name:string,model: AnyMongooseModel) : void{
        this.mModelsMapMap.get(connectionName).set(name,model);
    }


    initModels(connectionName:string,cn : mongoose.Connection){
        switch(connectionName){
            case "mongoose-test" :
               this.mModelsMapMap.set(connectionName,new Map());
               this.addModel(connectionName,"devise", initPersistentDeviseModel(cn) as any);
               this.addModel(connectionName,"publication", initPersistentPublicationModel(cn) as any);
            break;
            case "other-connection" :
               this.mModelsMapMap.set(connectionName,new Map());
               //this.addModel(connectionName,"xxx", initXxxModel(cn) as any);
               //this.addModel(connectionName,"yyyy", initYyyModel(cn) as any);
            break;
        }
    }

}

export const mongooseModels = new MongooseModels();

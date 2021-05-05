import { Sequelize , Model }from "sequelize";
import { initDeviseModel } from "./sq-devise";
import { initPublicationModel } from './sq-publication';

export class SqModels {


    //Map of Maps 
    //Main Map : for each connection-name of type "sequelize"
    //SubMap : <model-name , sequelizeDefinedModel >
    protected sqModelsMapMap : Map<string,Map<string,Model>>  = new Map();

    public modelsMapForConnection(connectionName:string): Map<string,Model> {
        return this.sqModelsMapMap.get(connectionName);
    }

    public  addModel(connectionName:string,name:string,model: Model) : void{
        this.sqModelsMapMap.get(connectionName).set(name,model);
    }


    initModels(connectionName:string,sequelize : Sequelize){
        switch(connectionName){
            case "sq-test" :
               this.sqModelsMapMap.set(connectionName,new Map());
               this.addModel(connectionName,"devise", initDeviseModel(sequelize) as any);
               this.addModel(connectionName,"publication", initPublicationModel(sequelize) as any);
            break;
            case "other-connection" :
               this.sqModelsMapMap.set(connectionName,new Map());
               //this.addModel(connectionName,"xxx", initXxxModel(sequelize) as any);
               //this.addModel(connectionName,"yyyy", initYyyModel(sequelize) as any);
            break;
        }
    }

}

export const sqModels = new SqModels();

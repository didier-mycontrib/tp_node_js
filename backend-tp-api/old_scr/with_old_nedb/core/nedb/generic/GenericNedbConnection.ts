import { confDbMap , IDbConfig } from "../../db-config";
import  Nedb = require('nedb');
import { MyAbstractDbConnection } from "../../my-db-connection";

export class MyNedbPseudoConnectionMap extends MyAbstractDbConnection{

    //private  db : Nedb =null; pas unique mais un db/nedb par collection/datastore !!!

    //NB: l'à peu près équivalent neDB d'une collection "mongoDB" 
    //est appelé "datastore" dans NeDB et correspond à une instance
    //de Nedb
    protected neDbMap : Map<string,Nedb> = new Map<string,Nedb>();//empty datastore/collection map

    private neDbPathPrefix: string = null; // "test" , "admin" , "db1" , ...
    
    constructor(connexionName:string){
        super(connexionName);
        let dbCfg : IDbConfig = confDbMap[connexionName as any];        
        this.neDbPathPrefix = "./"+dbCfg.database;          
    }

    public openConnection(collectionOrStoreName:string="default") : Promise<string>{
        let neDbPath = this.neDbPathPrefix + "/" + collectionOrStoreName + ".store.db";
        console.log("MyNedbPseudoConnectionMap, trying openConnection with neDbPath="+neDbPath);
        return new Promise((resolve,reject) => {
            if(this.neDbMap.get(collectionOrStoreName)!=null)
               resolve("neDb connection already initialized for collectionOrStoreName="+collectionOrStoreName);
            else{
              let db : Nedb = new Nedb({filename: neDbPath});
              this.neDbMap.set(collectionOrStoreName,db);
              db.loadDatabase((err) =>{   
                if(err != null){
                    reject("nedb connection fail");
                }else{
                    resolve("nedb connection succeed with path="+neDbPath);
                }
              });
            }
        });
    }
    public closeConnection() : Promise<void>{
       return  Promise.resolve(); //nothing to close with nedb (?)
    }
    public currentDb() : Map<string,Nedb> {
        return this.neDbMap;
    }

    public currentConnection(): object {
        return this.currentDb();
    }
}
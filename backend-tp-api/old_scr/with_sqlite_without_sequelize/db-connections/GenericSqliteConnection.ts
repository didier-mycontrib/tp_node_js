import { confDbMap , IDbConfig } from "./db-config";
import { MyAbstractDbConnection } from "./my-db-connection";
import * as sqlite from 'sqlite3';
const sqlite3 = sqlite.verbose();

export class MySqliteConnection extends MyAbstractDbConnection{
    public modelsMap(): object {
        return null;
    }
   
    private  db : sqlite.Database ;
    private dbName: string = null; // "test" , "admin" , "db1" , ...


    constructor(connexionName:string){
        super(connexionName);
        let dbCfg : IDbConfig = confDbMap[connexionName as any];
        
        this.dbName = dbCfg.database;      
        //openConnection(); should be called AFTER (Promise)
    }

    public openConnection() : Promise<string>{
        console.log("MySqliteConnection, trying openConnection with dbName="+this.dbName);
        return new Promise((resolve,reject) => {
            if(this.initialized)
               resolve("sqlite connection already initialized");
            else{
                this.db = new sqlite3.Database(this.dbName, (err) => {
                    if(err != null){
                        this.db = null;
                        reject("sqlite connection fail");
                    }else{
                        this.initialized=true;
                        resolve("sqlite connection succeed");
                    }
                });
            }
        });
    }
    public closeConnection() : Promise<void>{
       return new Promise((resolve,reject) => {
        this.db.close();
        resolve();
       });
    }

    public currentDb() : sqlite.Database {
        return this.db;
    }

    public currentConnection(): object {
        return this.currentDb();
    }
}
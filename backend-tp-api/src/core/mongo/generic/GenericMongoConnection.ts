import { confDbMap , IDbConfig } from "../../db-config";
import { MongoClient, Db } from "mongodb";
import { MyAbstractDbConnection } from "../../my-db-connection";

export class MyMongoConnection extends MyAbstractDbConnection{
   
   
    private  dbUrl : string = null;
    private  mongoClient : MongoClient = null;
    private  db : Db =null; 

    private host: string = null;  //"localhost" or ...
    private port: number =  null; //27017 ou ...
    private dbName: string = null; // "test" , "admin" , "db1" , ...
    private username: string = null;
    private password: string = null ;

    constructor(connexionName:string){
        super(connexionName);
        let dbCfg : IDbConfig = confDbMap[connexionName as any];
        this.host = dbCfg.host;  this.port = dbCfg.port;
        this.dbName = dbCfg.database;  this.username = dbCfg.user; this.password = dbCfg.password;
        let optionalAuthUrlPart = "";
        if(this.username!=null && this.password != null){
            optionalAuthUrlPart = `${this.username}:${this.password}@`
        }
        this.dbUrl = `mongodb://${optionalAuthUrlPart}${this.host}:${this.port}/${this.dbName}`;       
        //openConnection(); should be called AFTER (Promise)
    }

    public openConnection() : Promise<string>{
        console.log("MyMongoConnection, trying openConnection with dbUrl="+this.dbUrl);
        return new Promise((resolve,reject) => {
            if(this.initialized)
               resolve("mongodb connection already initialized");
            else
              MongoClient.connect(this.dbUrl,{ useNewUrlParser: true ,  useUnifiedTopology: true  } ,(err,mongoCli)=>{
                if(err != null){
                    reject("mongodb connection fail");
                }else{
                    this.mongoClient = mongoCli;
                    this.db = this.mongoClient.db(this.dbName);
                    this.initialized=true;
                    resolve("mongodb connection succeed");
                }
            }); 
            
        });
    }
    public closeConnection() : Promise<void>{
       return  this.mongoClient.close();
    }
    public currentDb() : Db {
        return this.db;
    }

    public currentConnection(): object {
        return this.currentDb();
    }
}
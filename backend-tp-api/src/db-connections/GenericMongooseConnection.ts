import { confDbMap , IDbConfig } from "./db-config";
import mongoose from 'mongoose';
import { MyAbstractDbConnection } from "./my-db-connection";
import { mongooseModels } from "../model/mongoose-model/mongooseModels";

type AnyMongooseModel = mongoose.Model<mongoose.Document<any, {}>, {}>

export class MyMongooseConnection extends MyAbstractDbConnection{
    public modelsMap(): object {
        return this.mModelsMap;
    }

    protected mModelsMap : Map<string,AnyMongooseModel> ;

	public  getModel(name:string): AnyMongooseModel{
		return this.mModelsMap.get(name);
	}
   
    private  dbUrl : string = null;
    private  cnx : mongoose.Connection =null; 

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
        console.log("MyMongooseConnection, trying openConnection with dbUrl="+this.dbUrl);
        return new Promise((resolve,reject) => {
            if(this.initialized)
               resolve("mongodb connection already initialized");
            else
            {
                //if just only one mongoose connection:
                //mongoose.connect(this.dbUrl, {useNewUrlParser: true, useUnifiedTopology: true});
                //this.cnx = mongoose.connection;
        
               mongoose.createConnection(this.dbUrl,{ useNewUrlParser: true ,  useUnifiedTopology: true})
               .then( (cn : mongoose.Connection) => {
                this.cnx = cn;
                this.initialized=true;
                mongooseModels.initModels(this.getName() , this.cnx);
                this.mModelsMap = mongooseModels.modelsMapForConnection(this.getName());
                
                resolve("mongoose connection succeed");
               })
              .catch( (error : any)=> { reject("mongoose connection fail");})
            }
        });
    }

    public closeConnection() : Promise<void>{
       return  this.cnx.close();
    }
    public currentDb() : mongoose.Connection {
        return this.cnx;
    }

    public currentConnection(): object {
        return this.currentDb();
    }
}
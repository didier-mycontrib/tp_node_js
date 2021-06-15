import { confDbMap , IDbConfig } from "./db-config";
import { MyAbstractDbConnection } from "./my-db-connection";
import { Sequelize , Op,Model }from "sequelize";

import { sqModels } from "../model/sequelize-model/sqModels";


export class MySequelizeConnection extends MyAbstractDbConnection{
    public modelsMap(): object {
        return this.sqModelsMap;
    }

    protected sqModelsMap : Map<string,Model>;

	public  getModel(name:string): Model{
		return this.sqModelsMap.get(name);
	}

    private dbName: string = null; // "test" , "admin" , "db1" , ...
    private username : string=null;
    private password : string=null;
    private sqOptions : any = null;
    private sequelize : Sequelize = null;

    constructor(connexionName:string){
        super(connexionName);
        let dbCfg : IDbConfig = confDbMap[connexionName as any];
        
        this.sqOptions = {
            dialect: dbCfg.dialect,
            port : dbCfg.port,
            host : dbCfg.host,
            logging: /*console.log*/false, // false or console.log,// permet de voir les logs de sequelize
            define: {
                timestamps: false
            },
            operatorsAliases: {   $gte: Op.gte , $gt: Op.gt , $lte: Op.lte , $lt: Op.lt }
            };
            this.password = dbCfg.password ? dbCfg.password : "";
            this.username=dbCfg.user;
            this.dbName = dbCfg.database;

        this.dbName = dbCfg.database;      
        //openConnection(); should be called AFTER (Promise)
    }

    public openConnection() : Promise<string>{
        console.log("MySequelizeConnection, trying openConnection with dbName="+this.dbName);
        return new Promise((resolve,reject) => {
            if(this.initialized)
               resolve("sequelize connection already initialized");
            else{
                this.sequelize = new Sequelize(this.dbName, this.username, this.password, this.sqOptions);
                sqModels.initModels(this.getName() , this.sequelize);
                this.sqModelsMap = sqModels.modelsMapForConnection(this.getName());
                
                /*
                if(this.sequelize == null){
                        reject("sequelize connection fail");
                    }else{
                        this.initialized=true;
                        resolve("sequelize connection succeed");
                    }*/
                this.sequelize.sync({logging: console.log})
                    .then( ()=>{ console.log("sequelize is initialized");
                                 this.initialized=true;
                                 resolve("sequelize connection succeed");
                                 }
                    ).catch( (err:any) => { 
                        console.log('An error occurred :', JSON.stringify(err)); 
                        reject("sequelize connection fail");
                    });
            }
        });
    }
    public closeConnection() : Promise<void>{
       return new Promise((resolve,reject) => {
        this.sequelize.close();
        resolve();
       });
    }

    public currentDb() : Sequelize {
        return this.sequelize;
    }

    public currentConnection(): object {
        return this.currentDb();
    }
}
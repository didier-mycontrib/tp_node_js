import * as dbCfg from './db.cfg.json';



// db config interface (config structure):
export interface IDbConfig {
	type: "mongodb" | "sequelize" | "mongoose" | "nedb";
	dialect: "mssql" | "mysql" | "postgres" | "sqlite" | "mariadb";
	host: string;
	port: number;
	database : string; //au sens path=`./${database}` pour nedb
	user: string;
	password : string ;
}


export const confDbMap : IDbConfig[] = dbCfg.dev as any;//or dbCfg.prod
//confDbMap["connexionName1"] , confDbMap["connexionName2"] 

import * as dbCfg from './db.cfg.json';



// db config interface (config structure):
export interface IDbConfig {
	type: "mongodb" | "sequelize";
	dialect: "mssql" | "mysql" | "postgres" | "sqlite" | "mariadb",
	host: string,
	port: number,
	database : string
	user: string
	password : string ;
}


export const confDbMap : IDbConfig[] = dbCfg.dev as any;//or dbCfg.prod
//confDbMap["connexionName1"] , confDbMap["connexionName2"] 

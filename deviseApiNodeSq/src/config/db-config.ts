import dbCfg from './database.cfg';


// db config
export interface IDbConfig {
	dialect: "mssql" | "mysql" | "postgres" | "sqlite" | "mariadb",
	host: string,
	port: number,
	database : string
	user: string
	password : string ;
}

let mode = process.env.MODE; //env variable MODE=dev or MODE=prod when launching node
if(mode == undefined) mode = "dev";
//console.log("in db-config, mode="+mode);
export const confDb : IDbConfig = (mode == "dev") ? dbCfg.dev as any : dbCfg.prod as any;
console.log("in db-config, confDb.host="+confDb.host);
if(confDb.port === undefined) {
   if(confDb.dialect=="mysql") {
	   confDb.port=3306;
   }
}


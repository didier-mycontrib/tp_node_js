

var env="dev" ; //or "prod"

// db config
export interface IDbConfig {
	dialect: "mssql" | "mysql" | "postgres" | "sqlite" | "mariadb",
	host: string,
	port: number,
	database : string
	user: string
	password : string ;
}


export const confDb : IDbConfig = require('./database.cfg.json')[env];
if(confDb.port === undefined) {
   if(confDb.dialect=="mysql") {
	   confDb.port=3306;
   }
}


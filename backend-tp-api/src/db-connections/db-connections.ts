import { IDbConfig } from "./db-config";

import { MyAbstractConnectionMap, MyAbstractDbConnection } from './my-db-connection';
import { MySequelizeConnection } from './GenericSequelizeConnection';
import { MyMongooseConnection } from './GenericMongooseConnection';


export class MyAppConnectionMap extends MyAbstractConnectionMap {
	
	constructor(){
		super();
		this.addConnection(new MySequelizeConnection("sq-test"));
		this.addConnection(new MyMongooseConnection("mongoose-test"));
	}

	public async initConnections(): Promise<boolean>{
		try{
			for(let [name,cn] of this.connectionMap){
				let connectionMessage = await cn.openConnection();
				console.log("connection "+name+" is ok:" + connectionMessage)
			}
		return true;
	   }catch(err){
			console.log("connection error:" + err);
			throw err;
		}
	}
}

export const myAppConnectionMap= new MyAppConnectionMap();


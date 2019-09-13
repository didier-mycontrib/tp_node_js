import { IDbConfig } from "./db-config";
import { MyMongoConnection } from "./mongo/generic/GenericMongoConnection";
import { MyAbstractConnectionMap, MyAbstractDbConnection } from './my-db-connection';


export class MyAppConnectionMap extends MyAbstractConnectionMap {
	
	constructor(){
		super();
		this.addConnection(new MyMongoConnection("mongo-test"));
		//this.addConnection(new MyMongoConnection("mongo-cn2"));
		//this.addConnection(new MySequelizeConnection("mysql-cnA"));
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


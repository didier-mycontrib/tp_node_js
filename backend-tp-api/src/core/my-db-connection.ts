export abstract class MyAbstractDbConnection {
	protected initialized : boolean = false;
	constructor(protected name:string){
	}
	public getName():string { return this.name; }
	public abstract openConnection():Promise<string>;
	public abstract closeConnection():Promise<void>;
	public abstract currentConnection():object|null;
	public isInitialized():boolean{ return this.initialized;}
}

export abstract class MyAbstractConnectionMap {
	protected connectionMap : Map<string,MyAbstractDbConnection>  = new Map();

	public  addConnection(cn: MyAbstractDbConnection) : void{
		this.connectionMap.set(cn.getName(),cn);
	}

	public  getConnection(name:string): MyAbstractDbConnection{
		return this.connectionMap.get(name);
	}

	public abstract async initConnections(): Promise<boolean>;
	
}



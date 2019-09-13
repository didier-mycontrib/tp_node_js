export interface IdHelper<T,ID>{
    extractId(e:T):ID; //extrait la valeur de la propriété faisant office de ID.PK
    isAuto():boolean;//true si auto_incr ou auto_gen , false sinon
    getIdPropName():string; //return id/pk property name (ex: id , _id , num , code , ...)
}

abstract class AbstractIdHelper<T,ID> implements IdHelper<T,ID>{
    constructor(protected idPropName:string , protected auto:boolean){
    }
    extractId(e:T):ID { 
        return Reflect.get(e as any,this.idPropName);
    } 
    public isAuto() : boolean {
        return this.auto;
    }

    getIdPropName(): string {
        return this.idPropName;
    }
}

export class AutoIdHelper<T,ID> extends AbstractIdHelper<T,ID>{
    constructor(idPropName:string="id"){
        super(idPropName,true);
    }
}

export class Auto_IdHelper<T,ID>  extends AbstractIdHelper<T,ID>{
    constructor(idPropName:string="_id"){
        super(idPropName,true);
    }
   
}

export class StaticIdHelper<T,ID>  extends AbstractIdHelper<T,ID>{
    constructor(idPropName:string="id"){
        super(idPropName,false);
    }
    
}




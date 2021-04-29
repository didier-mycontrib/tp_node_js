export interface IdHelper<T,ID>{
    extractId(e:T):ID; //extrait la valeur de la propriété faisant office de ID.PK
    setId(e:T,id:ID) : void;//fixe la (nouvelle) valeur de l'id
    isAuto():boolean;//true si auto_incr ou auto_gen , false sinon
    getIdPropName():string; //return id/pk property name (ex: id , _id , num , code , ...)
    getDefaultInitialValue():any; // return 1 ou "1" or ... to operate test type at runtime
}

abstract class AbstractIdHelper<T,ID> implements IdHelper<T,ID>{
    constructor(protected idPropName:string , protected auto:boolean , protected defaultInitialValue:any){
    }
    public extractId(e:T):ID { 
        return Reflect.get(e as any,this.idPropName);
    } 

    public setId(e:T,id:ID) : void { 
        Reflect.set(e as any,this.idPropName,id);
    }

    public isAuto() : boolean {
        return this.auto;
    }

    public getIdPropName(): string {
        return this.idPropName;
    }

    public getDefaultInitialValue():any{
        return this.defaultInitialValue;
    }
}

export class AutoIdHelper<T,ID> extends AbstractIdHelper<T,ID>{
    constructor(idPropName:string="id",defaultInitialValue:any=undefined){
        super(idPropName,true,defaultInitialValue);
    }
}

export class Auto_IdHelper<T,ID>  extends AbstractIdHelper<T,ID>{
    constructor(idPropName:string="_id",defaultInitialValue:any=undefined){
        super(idPropName,true,defaultInitialValue);
    }
   
}

export class StaticIdHelper<T,ID>  extends AbstractIdHelper<T,ID>{
    constructor(idPropName:string="id",defaultInitialValue:any=undefined){
        super(idPropName,false,defaultInitialValue);
    }
    
}




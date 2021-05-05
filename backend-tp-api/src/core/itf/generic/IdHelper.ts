export interface IdHelper<T,ID>{
    extractId(e:T):ID; //extrait la valeur de la propriété faisant office de ID.PK
    setId(e:T,id:ID) : void;//fixe la (nouvelle) valeur de l'id
    isAuto():boolean;//true si auto_incr ou auto_gen , false sinon
    getIdPropName():string; //return js id/pk property name (ex: id , _id , num , code , ...)
    getInternalIdPropName():string; //return internal id/pk property name in database (ex: _id , rowid , ...) , by default same as IdPropName
    extractInternalId(e:T):ID; //extrait la valeur de la propriété faisant office de ID.PK interne (en base)
    setInternalId(e:T,id:ID) : void;//fixe la (nouvelle) valeur de l'id interne (stocké en base )
    getDefaultInitialValue():any; // return 1 ou "1" or ... to operate test type at runtime
}

//si _id interne et id ou code ou ref en vision externe (ex: alias mongoose)
//alors recherche interne se _id interne

abstract class AbstractIdHelper<T,ID> implements IdHelper<T,ID>{
    constructor(protected idPropName:string , 
                protected auto:boolean , 
                protected internalIdPropName : string = idPropName,
                protected defaultInitialValue:any = undefined){
    }
    getInternalIdPropName(): string {
        return this.internalIdPropName;
    }
    public extractId(e:T):ID { 
        return Reflect.get(e as any,this.idPropName);
    } 

    public setInternalId(e:T,id:ID) : void { 
        Reflect.set(e as any,this.internalIdPropName,id);
    }

    public extractInternalId(e:T):ID { 
        return Reflect.get(e as any,this.internalIdPropName);
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
    constructor(idPropName:string="id",
                internalIdPropName : string = idPropName,
                defaultInitialValue:any=undefined,){
        super(idPropName,true,internalIdPropName,defaultInitialValue);
    }
}

export class Auto_IdHelper<T,ID>  extends AbstractIdHelper<T,ID>{
    constructor(idPropName:string="_id",
                internalIdPropName : string = idPropName,
                defaultInitialValue:any=undefined){
        super(idPropName,true,internalIdPropName,defaultInitialValue);
    }
   
}

export class StaticIdHelper<T,ID>  extends AbstractIdHelper<T,ID>{
    constructor(idPropName:string="id",
                internalIdPropName : string = idPropName,
                defaultInitialValue:any=undefined){
        super(idPropName,false,internalIdPropName,defaultInitialValue);
    }
    
}




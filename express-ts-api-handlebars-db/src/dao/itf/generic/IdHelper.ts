export interface IdHelper<T,ID>{
    extractId(e:T):ID; //extrait la valeur de la propriété faisant office de ID.PK
    isAuto():boolean;//true si auto_incr ou auto_gen , false sinon
}

export class AutoIdHelper<T,ID> implements IdHelper<T,ID>{

    constructor(private idPropName:string="id"){
    }
    extractId(e:T):ID { 
        return Reflect.get(this,this.idPropName);
    } 
    public isAuto() { return true};
}

export class StaticIdHelper<T,ID> implements IdHelper<T,ID>{

    constructor(private idPropName:string="id"){
    }
    extractId(e:T):ID { 
        return Reflect.get(this,this.idPropName);
    } 
    public isAuto() { return false};
}




import { BasicCrudService } from "./BasicCrudService";
import { Sequelize, Model , BuildOptions, Identifier} from 'sequelize';

// Need to declare the static model so `findOne` etc. use correct types.
type AnySqModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): Model ;
  }
  
  
export class GenericSequelizeDataService<T ,ID extends Identifier> implements BasicCrudService<T,ID> {

    constructor(private  sqModelStatic: AnySqModelStatic){
    }

    protected cloneJsObject(obj:object):object{
      return JSON.parse(JSON.stringify(obj));
    }

    protected basicEqualTest(obj1:object, obj2:object) : boolean{
     return  JSON.stringify(obj1) === JSON.stringify(obj2)
    }

    protected buildWhereCriteria(attrName:string,val:ID):any{
      let pkAttrName : string = this.sqModelStatic.primaryKeyAttribute;
      let criteriaObject = { where: { } };
      let boolRes= Reflect.defineProperty(criteriaObject.where, 
                                          attrName, 
                                          {value: val ,
                                            writable : true, enumerable : true, configurable : true
                                          });
      //console.log("criteriaObject:"+JSON.stringify(criteriaObject));                                          
      return criteriaObject;
    }
    
    findById(id: ID): Promise<T> {
      return new Promise<T>((resolve: Function, reject: Function) => {
        this.sqModelStatic.findByPk(id)
          .then((obj: Model) => {
            //returning null by default if not Found
            if(obj!=null)
                resolve(obj);
            else 
               reject(new Error("entity not found"));
          }).catch((error: Error) => {
            reject(error);
          });
      });
    }  

     findAll(): Promise<T[]> {
      return new Promise<T[]>((resolve: Function, reject: Function) => {
        this.sqModelStatic.findAll()
          .then((objects: Model[]) => {
            resolve(objects);
          }).catch((error: Error) => {
            reject(error);
          });
      });
    }

    saveOrUpdate(e: T): Promise<T> {
      let pkAttrName : string = this.sqModelStatic.primaryKeyAttribute;
      let pkValue = Reflect.get(e as any as object,pkAttrName);
      //.saveOrUpdate() via sq.upsert() just appropriate if no auto_increment
      return this.findById(pkValue)
        .then((obj: T) => {
          if(this.basicEqualTest(obj as any as object,e as any as object))
             //valeurs dejà identiques , rien à updater
             return new Promise((resolve)=>resolve(obj));
           else
             return this.update(e); //update sql
        },(error: any) => {
          return this.insert(e); //insert new
        });
    }

    insert(e: T): Promise<T> {
      return new Promise<T>((resolve: Function, reject: Function) => {
        this.sqModelStatic.create(e as any)
          .then((obj: Model) => {
            //console.log("*** after insert, obj:"+JSON.stringify(obj));
            resolve(obj);
          }).catch((error: any) => {
            console.log("err:"+JSON.stringify(error));
            reject(error);
          });
      });
    }
    update(e: T): Promise<T> {
      let pkAttrName : string = this.sqModelStatic.primaryKeyAttribute;
      let pkValue = Reflect.get(e as any as object,pkAttrName) ;
      //console.log("*** before update, pkAttrName:"+pkAttrName + " pkValue="+pkValue);
      //console.log("*** before update, new entity = "+JSON.stringify(e))
      return new Promise<T>((resolve: Function, reject: Function) => {
        this.sqModelStatic.update(this.cloneJsObject(e as any), this.buildWhereCriteria(pkAttrName,pkValue))
          .then((nbAffectedRows: number | any) => {
           // console.log("*** after update, nbAffectedRows="+nbAffectedRows);
            if(nbAffectedRows==1){
             // console.log("*** after update, obj:"+JSON.stringify(e));
              resolve(e);
            }
            else{
              //soit erreur , soit aucun changement
              reject(new Error("echec update"));
            }
          }).catch((error: any) => {
            //console.log("err:"+JSON.stringify(error));
            reject(error);
          });
      });
    }

    deleteById(id: ID): Promise<void> {
      let pkAttrName : string = this.sqModelStatic.primaryKeyAttribute;
     return new Promise<void>((resolve: Function, reject: Function) => {
       this.sqModelStatic.destroy(this.buildWhereCriteria(pkAttrName,id) )
          .then(() => {
            resolve();
          }).catch((error: any) => {
            //console.log("err:"+JSON.stringify(error));
            reject(error);
          });
      });
    }
  
  }
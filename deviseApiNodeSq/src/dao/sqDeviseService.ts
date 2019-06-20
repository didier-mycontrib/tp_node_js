import { DeviseDataService } from './deviseDataService'
import { Devise } from '../model/devise';
import { SqDevise, DeviseModelStatic } from '../model/sq-devise';
import { models } from '../model/global-db-model';
import { NotFoundError, ConflictError } from '../api/apiErrorHandler';
//"strictNullChecks": false in tsconfig.json

export class SqDeviseService implements DeviseDataService{
  
    deviseModelStatic : DeviseModelStatic = models.devises;

    constructor(){
    }

    findById(code: string): Promise<Devise> {
        return new Promise<Devise>((resolve: Function, reject: Function) => {
            this.deviseModelStatic.findByPk(code)
              .then((obj: SqDevise) => {
                //returning null by default if not Found
                if(obj!=null)
                    resolve(obj);
                else 
                   reject(new NotFoundError("devise not found with code="+code));
              })
              .catch((error: Error) => { reject(error);});
          });
    }   

    findAll(): Promise<Devise[]> {
        return new Promise((resolve,reject) => {
            this.deviseModelStatic.findAll()
          .then((objects: SqDevise[]) => {
            resolve(objects);
          }).catch((error: Error) => {
            reject(error);
          });
        });
    }

    insert(d: Devise): Promise<Devise> {
        return new Promise((resolve,reject) => {
            this.deviseModelStatic.create(d)
            .then((obj: SqDevise) => {
              //console.log("*** after insert, obj:"+JSON.stringify(obj));
              resolve(obj);
            }).catch((error: any) => {
              console.log("err:"+JSON.stringify(error));
              reject(error);
            });
         });
    }

    update(d: Devise): Promise<Devise> {
        return new Promise((resolve,reject) => {
            this.deviseModelStatic.update(d, { where: { code : d.code} })
            .then((nbAffectedRows: number | any) => {
              if(nbAffectedRows==1){
               // console.log("*** after update, obj:"+JSON.stringify(e));
                resolve(d);
              }
              else{
                //soit erreur , soit aucun changement !
                reject(new Error("no change or no update"));
              }
            }).catch((error: any) => {
              //console.log("err:"+JSON.stringify(error));
              reject(error);
            });
         });
    }

    saveOrUpdate(d: Devise): Promise<Devise> {
      return new Promise((resolve,reject) => {
        //.upsert() is appropriate for saveOrUpdate if no auto_incr
        this.deviseModelStatic.upsert(d)
        .then((ok: Boolean) => {
          //console.log("*** after insert, obj:"+JSON.stringify(obj));
          resolve(d);
        }).catch((error: any) => {
          console.log("err:"+JSON.stringify(error));
          reject(error);
        });
     });
    }

    deleteById(codeDev: string): Promise<void> {
        return new Promise((resolve,reject) => {
            this.deviseModelStatic.destroy( { where: { code : codeDev} } )
            .then(() => {
              resolve();
            }).catch((error: any) => {
              //console.log("err:"+JSON.stringify(error));
              reject(error);
            });
           });
    }

   

}
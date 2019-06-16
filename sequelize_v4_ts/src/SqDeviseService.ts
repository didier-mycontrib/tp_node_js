import SequelizeStatic from "sequelize";
import { DeviseDataService } from "./DeviseDataService";
import { DeviseAttributes ,DeviseInstance, Devise } from "./devise";
import { models } from './global-db-model';

//require "strictNullChecks": false in tsconfig.json

// Sequalize implementation of DeviseDataService 



class MySequelizeHelper<TAttr,TInstance,ID>{

    findByIdInModel(id: ID,model : SequelizeStatic.Model<TInstance,TAttr>): Promise<TAttr> {
        return new Promise<TAttr>((resolve: Function, reject: Function) => {
            let pk :any = id;
            model.findByPk(pk)
             .then((obj: TInstance) => {
               resolve(obj);
             }).catch((error: Error) => {
               reject(error);
             });
         });

    } 
}

export class SqDeviseService 
       implements DeviseDataService{

    private mySequelizeHelper = new MySequelizeHelper<DeviseAttributes,DeviseInstance,string>();

    findById(id: string): Promise<Devise> {
        return this.mySequelizeHelper.findByIdInModel(id,models.devises);
    }    
    
    findAll(): Promise<Devise[]> {
        return new Promise<Devise[]>((resolve: Function, reject: Function) => {
             models.devises.findAll()
              .then((devises: DeviseInstance[]) => {
                resolve(devises);
              }).catch((error: Error) => {
                reject(error);
              });
          });
    }

    save(e: Devise): Promise<Devise> {
        throw new Error("Method not implemented.");
    }


    insert(e: Devise): Promise<Devise> {
      return new Promise<DeviseAttributes>((resolve: Function, reject: Function) => {
        models.devises.create(e)
          .then((dev: DeviseInstance) => {
            console.log("dev:"+JSON.stringify(dev));
            resolve(dev/*dev.dataValues*/);
          }).catch((error: any) => {
            console.log("err:"+JSON.stringify(error));
            reject(error);
          });
      });
    }

    update(e: Devise): Promise<Devise> {
        throw new Error("Method not implemented.");
    }

    deleteById(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }



}
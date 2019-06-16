import { Model} from 'sequelize';
import { DeviseDataService } from "../itf/DeviseDataService";
import { DeviseAttributes , Devise } from "../../model/devise";
import { models } from '../../model/sequelize/global-db-model';
import { DeviseInstance} from '../../model/sequelize/dev-sq-itf'
import { NotFoundError } from "../..//error/Errors";
import { MySequelizeHelper } from './generic/MySequelizeHelper';

//require "strictNullChecks": false in tsconfig.json

// Sequalize implementation of DeviseDataService 

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
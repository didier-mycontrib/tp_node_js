import { GenericSequelizeDataService } from "./GenericSequelizeDataService";
import { Sequelize, Model } from 'sequelize';
import { models } from './global-db-model';
import { UserDataService } from "./UserDataService";
import { User } from "./user";




export class SqUserService extends GenericSequelizeDataService<User,number>
       implements UserDataService{

    constructor(){
      super(models.users);
    }


}
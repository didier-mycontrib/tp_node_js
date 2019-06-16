import { GenericSequelizeDataService } from "./GenericSequelizeDataService";
import { DeviseDataService } from "./DeviseDataService";
import { Sequelize, Model } from 'sequelize';
import { Devise } from "./devise";
import { SqDevise , DeviseModelStatic} from "./sq-devise";
import { models } from './global-db-model';




export class SqDeviseService extends GenericSequelizeDataService<Devise,string>
       implements DeviseDataService{

    constructor(){
      super(models.devises);
    }


}
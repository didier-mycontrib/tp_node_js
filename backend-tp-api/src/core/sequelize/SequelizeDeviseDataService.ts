import { DeviseDataService } from "../itf/DeviseDataService";
import { GenericSequelizeDataService } from "./generic/GenericSequelizeDataService";
import { Devise , DeviseObject  } from "../../model/devise";
import { IdHelper, StaticIdHelper } from "../itf/generic/IdHelper";
import { DeviseModelStatic } from '../../model/sequelize-model/sq-devise';
import { Op } from "sequelize";
// Sequelize implementation of DeviseDataService 



export class SequelizeDeviseService 
       extends GenericSequelizeDataService<Devise,string>
       implements DeviseDataService {

    private  persistentDeviseModel : DeviseModelStatic  ;
        //défini dans model/sequelize/sq-devise.ts 
        //plus précis que sequelizeModel (de la super classe)
        //et à utiliser pour coder les méthodes
        //de recherches spécifiques (non génériques)     

    constructor(){
        super("sq-test" , "devise" ,  new StaticIdHelper<Devise,string>("code"));
        this.initModel()
            .then((model)=> {
                this.persistentDeviseModel = model as any as  DeviseModelStatic;
                this.initDataSet();
            })
            .catch((error: Error) => { console.log("erreur initialisation SequelizeDeviseService" + JSON.stringify(error)) });
        
    }

    initDataSet(){
            this.saveOrUpdate( new DeviseObject("USD" , "Dollar" , 1));
            this.saveOrUpdate( new DeviseObject("EUR" , "Euro" , 0.92));
            this.saveOrUpdate( new DeviseObject("GBP" , "Livre" , 0.82));
            this.saveOrUpdate( new DeviseObject("JPY" , "Yen" , 132.02));
          }

    async findByChangeMini(changeMini: number): Promise<Devise[]> {
        let query = changeMini?{ change : { [Op.gte] : changeMini } }:{};
        let criteria = { where : query }
        return this.persistentDeviseModel.findAll(criteria);
    }
     
}
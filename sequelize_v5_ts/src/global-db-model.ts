import { Sequelize , Model }from "sequelize";
import { DeviseModelStatic , initDeviseModel } from './sq-devise';
import { confDb  } from "./db-config"
import { UserModelStatic , initUserModel } from "./sq-user";
import { PaysModelStatic, initPaysModel } from "./sq-pays";


// with "strictPropertyInitialization": false in tsconfig.json
export class MyApiModels {
    public devises! : DeviseModelStatic;
    public pays! : PaysModelStatic;
    public users! : UserModelStatic;
  }
  
  export class MySqDatabase {
    private models: MyApiModels;
    private sequelize: Sequelize;
    public dbname: string = "unknown";
  
    constructor() {
      this.models = new MyApiModels();
      let model: any;
      let sqOptions = {
            dialect: confDb.dialect,
            port : confDb.port,
            logging: /*console.log*/false, // false or console.log,// permet de voir les logs de sequelize
            define: {
                timestamps: false
            }
      };
      var password = confDb.password ? confDb.password : "";
      this.sequelize = new Sequelize(confDb.database, confDb.user, password, sqOptions);
      this.dbname = confDb.database;
     
     this.models.devises= initDeviseModel(this.sequelize);
     this.models.users= initUserModel(this.sequelize);
     this.models.pays= initPaysModel(this.sequelize);
     this.models.devises.hasMany(this.models.pays);
    }
  
    getModels() {
      return this.models;
    }
  
    getSequelize() {
      return this.sequelize;
    }
  }
  
  export const database: MySqDatabase = new MySqDatabase();
  export const models = database.getModels();
  export const sequelize: Sequelize = database.getSequelize();



import { Sequelize , Model }from "sequelize";
import { DeviseModelStatic , initDeviseModel } from './sq-devise';
import { confDb  } from "../config/db-config"
//import { PaysModelStatic , initPaysModel } from "./sq-pays";

export class MyApiModels {
    public devises! : DeviseModelStatic;
    //public pays! : PaysModelStatic;
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
     //this.models.pays= initPaysModel(this.sequelize);
      /*
      model = this.sequelize.import('./AUTRE_OBJET');
      this.models.autreObjets = model as SequelizeStatic.Model<.., ...>;
      this.models.autreObjets.belongsTo(this.models.objets, { foreignKey: 'OBJET_ID' });
      */
      /* import automatique
      fs.readdirSync(__dirname).filter((file: string) => {
      return (file !== this._basename) && (file !== "iface");
      }).forEach((file: string) => {
      let model = this._sequelize.import(path.join(__dirname, file));
      console.log(`importing ${path.join(__dirname, file)}`);
      this._models[(model as any).name] = model;
      });
  
      Object.keys(this._models).forEach((modelName: string) => {
      if (typeof this._models[modelName].associate === "function") {
          this._models[modelName].associate(this._models);
      }
      });
      */
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

  export function initSequelize(){
    sequelize.sync({logging: console.log})
			  .then(
				()=>{ 
							console.log("sequelize is initialized");
            }
			  ).catch( (err:any) => { console.log('An error occurred :', err);  });
  }



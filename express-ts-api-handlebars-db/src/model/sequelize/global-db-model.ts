import SequelizeStatic from "sequelize";
import { DeviseInstance } from "./dev-sq-itf";
import { DeviseAttributes } from '../devise';
import { confDb  } from "../../config/db-config"


// with "strictPropertyInitialization": false in tsconfig.json
export class TApiModel {
    public devises: SequelizeStatic.Model<DeviseInstance, DeviseAttributes>;
    //public autreObjets: SequelizeStatic.Model<..., ...>
  }
  
  export class TDatabase {
    private models: TApiModel;
    private sequelize: SequelizeStatic.Sequelize;
    public dbname: string = "unknown";
  
    constructor() {
      this.models = new TApiModel();
      let model: any;
      let sqOptions = {
            dialect: confDb.dialect,
            port : confDb.port,
            logging: false, // false or console.log,// permet de voir les logs de sequelize
            define: {
                timestamps: false
            }
      };
      var password = confDb.password ? confDb.password : "";
      this.sequelize = new SequelizeStatic(confDb.database, confDb.user, password, sqOptions);
      this.dbname = confDb.database;
      model = this.sequelize.import('./devise-model');
      this.models.devises = model as SequelizeStatic.Model<DeviseInstance, DeviseAttributes>;
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
  
  export const database: TDatabase = new TDatabase();
  export const models = database.getModels();
  export const sequelize: SequelizeStatic.Sequelize = database.getSequelize();



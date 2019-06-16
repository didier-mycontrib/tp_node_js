"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const devise_1 = require("./devise");
const db_config_1 = require("./db-config");
// with "strictPropertyInitialization": false in tsconfig.json
class MyApiModels {
}
exports.MyApiModels = MyApiModels;
class MySqDatabase {
    constructor() {
        this.dbname = "unknown";
        this.models = new MyApiModels();
        let model;
        let sqOptions = {
            dialect: db_config_1.confDb.dialect,
            port: db_config_1.confDb.port,
            logging: /*console.log*/ false,
            define: {
                timestamps: false
            }
        };
        var password = db_config_1.confDb.password ? db_config_1.confDb.password : "";
        this.sequelize = new sequelize_1.Sequelize(db_config_1.confDb.database, db_config_1.confDb.user, password, sqOptions);
        this.dbname = db_config_1.confDb.database;
        /*
        model = this.sequelize.import('./devise-model');
        this.models.devises = model as SequelizeStatic.Model<DeviseInstance, DeviseAttributes>;
        */
        this.models.devises = devise_1.deviseModelFactory(this.sequelize, sequelize_1.Sequelize);
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
exports.MySqDatabase = MySqDatabase;
exports.database = new MySqDatabase();
exports.models = exports.database.getModels();
exports.sequelize = exports.database.getSequelize();

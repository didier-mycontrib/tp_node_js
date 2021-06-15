"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequelizeDeviseService = void 0;
const GenericSequelizeDataService_1 = require("./generic/GenericSequelizeDataService");
const devise_1 = require("../../model/devise");
const IdHelper_1 = require("../itf/generic/IdHelper");
const sequelize_1 = require("sequelize");
// Sequelize implementation of DeviseDataService 
class SequelizeDeviseService extends GenericSequelizeDataService_1.GenericSequelizeDataService {
    //défini dans model/sequelize/sq-devise.ts 
    //plus précis que sequelizeModel (de la super classe)
    //et à utiliser pour coder les méthodes
    //de recherches spécifiques (non génériques)     
    constructor() {
        super("sq-test", "devise", new IdHelper_1.StaticIdHelper("code"));
        this.initModel()
            .then((model) => {
            this.persistentDeviseModel = model;
            this.initDataSet();
        })
            .catch((error) => { console.log("erreur initialisation SequelizeDeviseService" + JSON.stringify(error)); });
    }
    initDataSet() {
        this.saveOrUpdate(new devise_1.DeviseObject("USD", "Dollar", 1));
        this.saveOrUpdate(new devise_1.DeviseObject("EUR", "Euro", 0.92));
        this.saveOrUpdate(new devise_1.DeviseObject("GBP", "Livre", 0.82));
        this.saveOrUpdate(new devise_1.DeviseObject("JPY", "Yen", 132.02));
    }
    async findByChangeMini(changeMini) {
        let query = changeMini ? { change: { [sequelize_1.Op.gte]: changeMini } } : {};
        let criteria = { where: query };
        return this.persistentDeviseModel.findAll(criteria);
    }
}
exports.SequelizeDeviseService = SequelizeDeviseService;

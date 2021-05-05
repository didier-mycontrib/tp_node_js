"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongooseDeviseService = void 0;
const GenericMongooseDataService_1 = require("./generic/GenericMongooseDataService");
const devise_1 = require("../../model/devise");
const IdHelper_1 = require("../itf/generic/IdHelper");
// MongoDB implementation of DeviseDataService 
class MongooseDeviseService extends GenericMongooseDataService_1.GenericMongooseDataService {
    //défini dans model/mongoose/m-devise.ts 
    //plus précis que mongooseModel (de la super classe)
    //et à utiliser pour coder les méthodes
    //de recherches spécifiques (non génériques)
    constructor() {
        super("mongoose-test", "devise", new IdHelper_1.StaticIdHelper("code", "_id"));
        this.initModel()
            .then((model) => {
            this.persistentDeviseModel = model;
            this.initDataSet();
        })
            .catch((error) => { console.log("erreur initialisation MongooseDeviseService"); });
    }
    initDataSet() {
        this.saveOrUpdate(new devise_1.DeviseObject("USD", "Dollar", 1));
        this.saveOrUpdate(new devise_1.DeviseObject("EUR", "Euro", 0.91));
        this.saveOrUpdate(new devise_1.DeviseObject("GBP", "Livre", 0.81));
        this.saveOrUpdate(new devise_1.DeviseObject("JPY", "Yen", 132.01));
    }
    // findByChangeMini(changeMini: number): Promise<Devise[]> {
    async findByChangeMini(changeMini) {
        let query = changeMini ? { change: { $gte: changeMini } } : {};
        return this.persistentDeviseModel.find(query);
    }
}
exports.MongooseDeviseService = MongooseDeviseService;

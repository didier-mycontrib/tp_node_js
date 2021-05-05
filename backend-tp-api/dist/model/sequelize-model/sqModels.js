"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqModels = exports.SqModels = void 0;
const sq_devise_1 = require("./sq-devise");
const sq_publication_1 = require("./sq-publication");
class SqModels {
    constructor() {
        //Map of Maps 
        //Main Map : for each connection-name of type "sequelize"
        //SubMap : <model-name , sequelizeDefinedModel >
        this.sqModelsMapMap = new Map();
    }
    modelsMapForConnection(connectionName) {
        return this.sqModelsMapMap.get(connectionName);
    }
    addModel(connectionName, name, model) {
        this.sqModelsMapMap.get(connectionName).set(name, model);
    }
    initModels(connectionName, sequelize) {
        switch (connectionName) {
            case "sq-test":
                this.sqModelsMapMap.set(connectionName, new Map());
                this.addModel(connectionName, "devise", sq_devise_1.initDeviseModel(sequelize));
                this.addModel(connectionName, "publication", sq_publication_1.initPublicationModel(sequelize));
                break;
            case "other-connection":
                this.sqModelsMapMap.set(connectionName, new Map());
                //this.addModel(connectionName,"xxx", initXxxModel(sequelize) as any);
                //this.addModel(connectionName,"yyyy", initYyyModel(sequelize) as any);
                break;
        }
    }
}
exports.SqModels = SqModels;
exports.sqModels = new SqModels();

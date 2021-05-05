"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongooseModels = exports.MongooseModels = void 0;
const m_devise_1 = require("./m-devise");
const m_publication_1 = require("./m-publication");
class MongooseModels {
    constructor() {
        //Map of Maps 
        //Main Map : for each connection-name of type "mongoose"
        //SubMap : <model-name , MongooseModel >
        this.mModelsMapMap = new Map();
    }
    modelsMapForConnection(connectionName) {
        return this.mModelsMapMap.get(connectionName);
    }
    addModel(connectionName, name, model) {
        this.mModelsMapMap.get(connectionName).set(name, model);
    }
    initModels(connectionName, cn) {
        switch (connectionName) {
            case "mongoose-test":
                this.mModelsMapMap.set(connectionName, new Map());
                this.addModel(connectionName, "devise", m_devise_1.initPersistentDeviseModel(cn));
                this.addModel(connectionName, "publication", m_publication_1.initPersistentPublicationModel(cn));
                break;
            case "other-connection":
                this.mModelsMapMap.set(connectionName, new Map());
                //this.addModel(connectionName,"xxx", initXxxModel(cn) as any);
                //this.addModel(connectionName,"yyyy", initYyyModel(cn) as any);
                break;
        }
    }
}
exports.MongooseModels = MongooseModels;
exports.mongooseModels = new MongooseModels();

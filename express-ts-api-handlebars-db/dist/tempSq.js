"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SqDeviseService_1 = require("./dao/sequelize/SqDeviseService");
const global_db_model_1 = require("./model/sequelize/global-db-model");
global_db_model_1.sequelize.sync({ logging: console.log })
    .then(() => {
    doJobWithSequelize();
}).catch((err) => { console.log('An error occurred :', err); });
function doJobWithSequelize() {
    let sqDeviseService = new SqDeviseService_1.SqDeviseService();
    sqDeviseService.findById("EUR")
        .then((dev) => { console.log("devise EUR found:" + JSON.stringify(dev)); })
        .catch((e) => { console.log("error:" + JSON.stringify(e)); });
    /*
     sqDeviseService.addDevise({code:'EUR',name:'Euro',change:0.9})
     .then( (dev)=>{ console.log("added:" + JSON.stringify(dev)); })
     .catch( (e) => { console.log("error:"+JSON.stringify(e)); })
    */
}

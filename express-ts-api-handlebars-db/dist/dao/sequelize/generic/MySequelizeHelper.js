"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MySequelizeHelper {
    dataValuesOfInstance(instance) {
        /*
        let dataValues : any;
        let object : any = instance;
        dataValues = Reflect.get(object,"dataValues");
        return dataValues as TAttr;
        */
        return instance;
    }
    //To improve (model : any) ---> (model : AppropriateType)
    findByIdInModel(id, model) {
        return new Promise((resolve, reject) => {
            let pk = id;
            model.findByPk(pk)
                .then((devise) => {
                resolve(this.dataValuesOfInstance(devise));
            }).catch((error) => {
                reject(error);
            });
        });
    }
}
exports.MySequelizeHelper = MySequelizeHelper;

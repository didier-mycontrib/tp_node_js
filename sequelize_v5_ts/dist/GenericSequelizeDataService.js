"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GenericSequelizeDataService {
    constructor(sqModelStatic) {
        this.sqModelStatic = sqModelStatic;
    }
    cloneJsObject(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
    basicEqualTest(obj1, obj2) {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    }
    buildWhereCriteria(attrName, val) {
        let pkAttrName = this.sqModelStatic.primaryKeyAttribute;
        let criteriaObject = { where: {} };
        let boolRes = Reflect.defineProperty(criteriaObject.where, attrName, { value: val,
            writable: true, enumerable: true, configurable: true
        });
        //console.log("criteriaObject:"+JSON.stringify(criteriaObject));                                          
        return criteriaObject;
    }
    findById(id) {
        return new Promise((resolve, reject) => {
            this.sqModelStatic.findByPk(id)
                .then((obj) => {
                //returning null by default if not Found
                if (obj != null)
                    resolve(obj);
                else
                    reject(new Error("entity not found"));
            }).catch((error) => {
                reject(error);
            });
        });
    }
    findAll() {
        return new Promise((resolve, reject) => {
            this.sqModelStatic.findAll()
                .then((objects) => {
                resolve(objects);
            }).catch((error) => {
                reject(error);
            });
        });
    }
    saveOrUpdate(e) {
        let pkAttrName = this.sqModelStatic.primaryKeyAttribute;
        let pkValue = Reflect.get(e, pkAttrName);
        //.saveOrUpdate() via sq.upsert() just appropriate if no auto_increment
        return this.findById(pkValue)
            .then((obj) => {
            if (this.basicEqualTest(obj, e))
                //valeurs dejà identiques , rien à updater
                return new Promise((resolve) => resolve(obj));
            else
                return this.update(e); //update sql
        }, (error) => {
            return this.insert(e); //insert new
        });
    }
    insert(e) {
        return new Promise((resolve, reject) => {
            this.sqModelStatic.create(e)
                .then((obj) => {
                //console.log("*** after insert, obj:"+JSON.stringify(obj));
                resolve(obj);
            }).catch((error) => {
                console.log("err:" + JSON.stringify(error));
                reject(error);
            });
        });
    }
    update(e) {
        let pkAttrName = this.sqModelStatic.primaryKeyAttribute;
        let pkValue = Reflect.get(e, pkAttrName);
        //console.log("*** before update, pkAttrName:"+pkAttrName + " pkValue="+pkValue);
        //console.log("*** before update, new entity = "+JSON.stringify(e))
        return new Promise((resolve, reject) => {
            this.sqModelStatic.update(this.cloneJsObject(e), this.buildWhereCriteria(pkAttrName, pkValue))
                .then((nbAffectedRows) => {
                // console.log("*** after update, nbAffectedRows="+nbAffectedRows);
                if (nbAffectedRows == 1) {
                    // console.log("*** after update, obj:"+JSON.stringify(e));
                    resolve(e);
                }
                else {
                    //soit erreur , soit aucun changement
                    reject(new Error("echec update"));
                }
            }).catch((error) => {
                //console.log("err:"+JSON.stringify(error));
                reject(error);
            });
        });
    }
    deleteById(id) {
        let pkAttrName = this.sqModelStatic.primaryKeyAttribute;
        return new Promise((resolve, reject) => {
            this.sqModelStatic.destroy(this.buildWhereCriteria(pkAttrName, id))
                .then(() => {
                resolve();
            }).catch((error) => {
                //console.log("err:"+JSON.stringify(error));
                reject(error);
            });
        });
    }
}
exports.GenericSequelizeDataService = GenericSequelizeDataService;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GenericSequelizeDataService {
    constructor(sqModelStatic) {
        this.sqModelStatic = sqModelStatic;
    }
    findById(id) {
        return new Promise((resolve, reject) => {
            this.sqModelStatic.findByPk(id)
                .then((obj) => {
                resolve(obj);
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
    save(e) {
        throw new Error("Method not implemented.");
    }
    insert(e) {
        throw new Error("Method not implemented.");
    }
    update(e) {
        throw new Error("Method not implemented.");
    }
    deleteById(id) {
        throw new Error("Method not implemented.");
    }
}
exports.GenericSequelizeDataService = GenericSequelizeDataService;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IdHelper_1 = require("../../itf/generic/IdHelper");
const Errors_1 = require("../../../error/Errors");
class GenericMemDataService {
    constructor() {
        this.lastId = 0; //if ID=number and idHelper.isAuto() only
        this.dataMap = new Map(); //empty map
        //may be replaced/override in subclass:
        this.idHelper = new IdHelper_1.AutoIdHelper(); //.id
    }
    insert(dataObj) {
        return new Promise((resolve, reject) => {
            let id = this.idHelper.extractId(dataObj);
            if (!this.idHelper.isAuto() && id == null)
                reject(new Error("entity must have a valid defined id , no auto_incr"));
            if (this.idHelper.isAuto() && id == null)
                id = (++this.lastId);
            this.dataMap.set(id, dataObj);
            resolve(dataObj);
        });
    }
    save(dataObj) {
        return new Promise((resolve, reject) => {
            let id = this.idHelper.extractId(dataObj);
            if (this.idHelper.isAuto() && id == null) {
                this.insert(dataObj).then((data) => { resolve(data); }, (ex) => { reject(ex); });
            }
            else {
                this.update(dataObj).then((data) => { resolve(data); }, (ex) => { reject(ex); });
            }
        });
    }
    update(dataObj) {
        return new Promise((resolve, reject) => {
            let id = this.idHelper.extractId(dataObj);
            this.dataMap.set(id, dataObj);
            resolve(dataObj);
        });
    }
    deleteById(id) {
        return new Promise((resolve, reject) => {
            if (this.dataMap.has(id)) {
                this.dataMap.delete(id);
                resolve();
            }
            else {
                reject(new Errors_1.NotFoundError("not found for delete"));
            }
        });
    }
    findById(id) {
        return new Promise((resolve, reject) => {
            if (this.dataMap.has(id)) {
                let dataObj = this.dataMap.get(id);
                resolve(dataObj);
            }
            else {
                reject(new Errors_1.NotFoundError("not found (id=" + id + ")"));
            }
        });
    }
    findAll() {
        return new Promise((resolve, reject) => {
            let allDataIterables = this.dataMap.values();
            let allDataArray = [...allDataIterables];
            resolve(allDataArray);
        });
    }
}
exports.GenericMemDataService = GenericMemDataService;

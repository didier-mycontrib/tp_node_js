"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var global_db_model_1 = require("../model/global-db-model");
var apiErrorHandler_1 = require("../api/apiErrorHandler");
//"strictNullChecks": false in tsconfig.json
var SqDeviseService = /** @class */ (function () {
    function SqDeviseService() {
        this.deviseModelStatic = global_db_model_1.models.devises;
    }
    SqDeviseService.prototype.findById = function (code) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.deviseModelStatic.findByPk(code)
                .then(function (obj) {
                //returning null by default if not Found
                if (obj != null)
                    resolve(obj);
                else
                    reject(new apiErrorHandler_1.NotFoundError("devise not found with code=" + code));
            })
                .catch(function (error) { reject(error); });
        });
    };
    SqDeviseService.prototype.findAll = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.deviseModelStatic.findAll()
                .then(function (objects) {
                resolve(objects);
            }).catch(function (error) {
                reject(error);
            });
        });
    };
    SqDeviseService.prototype.insert = function (d) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.deviseModelStatic.create(d)
                .then(function (obj) {
                //console.log("*** after insert, obj:"+JSON.stringify(obj));
                resolve(obj);
            }).catch(function (error) {
                console.log("err:" + JSON.stringify(error));
                reject(error);
            });
        });
    };
    SqDeviseService.prototype.update = function (d) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.deviseModelStatic.update(d, { where: { code: d.code } })
                .then(function (nbAffectedRows) {
                if (nbAffectedRows == 1) {
                    // console.log("*** after update, obj:"+JSON.stringify(e));
                    resolve(d);
                }
                else {
                    //soit erreur , soit aucun changement !
                    reject(new Error("no change or no update"));
                }
            }).catch(function (error) {
                //console.log("err:"+JSON.stringify(error));
                reject(error);
            });
        });
    };
    SqDeviseService.prototype.saveOrUpdate = function (d) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            //.upsert() is appropriate for saveOrUpdate if no auto_incr
            _this.deviseModelStatic.upsert(d)
                .then(function (ok) {
                //console.log("*** after insert, obj:"+JSON.stringify(obj));
                resolve(d);
            }).catch(function (error) {
                console.log("err:" + JSON.stringify(error));
                reject(error);
            });
        });
    };
    SqDeviseService.prototype.deleteById = function (codeDev) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.deviseModelStatic.destroy({ where: { code: codeDev } })
                .then(function () {
                resolve();
            }).catch(function (error) {
                //console.log("err:"+JSON.stringify(error));
                reject(error);
            });
        });
    };
    return SqDeviseService;
}());
exports.SqDeviseService = SqDeviseService;

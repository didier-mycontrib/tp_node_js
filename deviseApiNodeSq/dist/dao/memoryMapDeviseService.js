"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var devise_1 = require("../model/devise");
var apiErrorHandler_1 = require("../api/apiErrorHandler");
var MemoryMapDeviseService = /** @class */ (function () {
    function MemoryMapDeviseService() {
        this.delay = 50; //50ms (simulation async)
        this.mapDevises = new Map();
        //JEUX DE DONNEES INITIAL (TP):
        this.mapDevises.set("EUR", new devise_1.DeviseObject("EUR", "euro", 1));
        this.mapDevises.set("USD", new devise_1.DeviseObject("USD", "dollar", 1.1));
        this.mapDevises.set("GBP", new devise_1.DeviseObject("GBP", "livre", 0.9));
        this.mapDevises.set("JPY", new devise_1.DeviseObject("JPY", "yen", 132));
    }
    MemoryMapDeviseService.prototype.findById = function (code) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                if (_this.mapDevises.has(code)) {
                    var deviseObj = _this.mapDevises.get(code);
                    resolve(deviseObj);
                }
                else {
                    reject(new apiErrorHandler_1.NotFoundError("devise not found (code=" + code + ")"));
                }
            }, _this.delay); //simulation attente (async)
        });
    };
    MemoryMapDeviseService.prototype.findAll = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var allDataIterables = _this.mapDevises.values();
            var allDataArray = __spread(allDataIterables);
            resolve(allDataArray);
        });
    };
    MemoryMapDeviseService.prototype.insert = function (d) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.mapDevises.has(d.code))
                reject(new apiErrorHandler_1.ConflictError("devise already exist with code=" + d.code));
            _this.mapDevises.set(d.code, d);
            resolve(d);
        });
    };
    MemoryMapDeviseService.prototype.update = function (d) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.mapDevises.has(d.code))
                reject(new apiErrorHandler_1.NotFoundError("cannot update, devise not found with code=" + d.code));
            _this.mapDevises.set(d.code, d);
            resolve(d);
        });
    };
    MemoryMapDeviseService.prototype.deleteById = function (code) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.mapDevises.has(code)) {
                _this.mapDevises.delete(code);
                resolve();
            }
            else {
                reject(new apiErrorHandler_1.NotFoundError("devise not found for delete with code=" + code));
            }
        });
    };
    MemoryMapDeviseService.prototype.saveOrUpdate = function (d) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.mapDevises.set(d.code, d);
            resolve(d);
        });
    };
    return MemoryMapDeviseService;
}());
exports.MemoryMapDeviseService = MemoryMapDeviseService;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const services_index_1 = require("../dao/services.index");
const genericHandlers_1 = require("./genericHandlers");
exports.publicApiRouter = express_1.Router();
// GET .../public/devise/EUR
exports.publicApiRouter.route('/my-api/public/devise/:code')
    .get(function (req, res) {
    return genericHandlers_1.promiseToJsonResponse(services_index_1.deviseDataService.findById(req.params.code), res);
});
exports.publicApiRouter.route('/my-api/public/devise')
    .get(function (req, res) {
    return genericHandlers_1.promiseToJsonResponse(services_index_1.deviseDataService.findAll(), res);
});

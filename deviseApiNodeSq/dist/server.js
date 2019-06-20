"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var bodyParser = __importStar(require("body-parser"));
exports.app = express_1.default();
var apiErrorHandler_1 = require("./api/apiErrorHandler");
var apiRoutes_1 = require("./api/apiRoutes");
var global_db_model_1 = require("./model/global-db-model");
//PRE TRAITEMENTS (à placer en haut de server.ts)
//support parsing of JSON post data
var jsonParser = bodyParser.json();
exports.app.use(jsonParser);
//ROUTES ORDINAIRES (apres PRE traitements , avant POST traitements)
exports.app.use(apiRoutes_1.apiRouter); //delegate REST API routes to apiRouter
//app.use(apiRouter2); //delegate REST API routes to apiRouter2
//POST TRAITEMENTS (à placer en bas de server.ts):
exports.app.use(apiErrorHandler_1.apiErrorHandler); //pour gérer les erreurs/exceptions
//pas rattrapées par try/catch et qui se propagent
//alors automatiquement au niveau "express appelant mon code"
exports.server = exports.app.listen(8282, function () {
    var mode = process.env.MODE; //env variable MODE=dev or MODE=prod when launching node
    if (mode == undefined)
        mode = "dev";
    console.log("mode=" + mode);
    console.log("http://localhost:8282");
    global_db_model_1.initSequelize();
});

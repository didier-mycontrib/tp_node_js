"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var sqDeviseService_1 = require("../dao/sqDeviseService");
var resConv_1 = require("./dto/resConv");
exports.apiRouter = express_1.Router();
//var  deviseService : DeviseDataService = new MemoryMapDeviseService();
var deviseService = new sqDeviseService_1.SqDeviseService();
function asyncToResp(fn) {
    return function (req, res, next) {
        // Make sure to `.catch()` any errors and pass them along to the `next()`
        // middleware in the chain, in this case the error handler.
        fn(req, res, next)
            .then(function (data) { res.send(data); })
            .catch(next);
    };
}
/**
 * @apidefine DeviseStructure
 * @apiSuccess {String} devise.code code of Devise (ex: EUR , USD, GBP , JPY, ...)
 * @apiSuccess {String} devise.monnaie  name of Devise (ex: euro , dollar , livre , yen)
 * @apiSuccess {Number} devise.tauxChange  change for 1 euro.
 */
// http://http://localhost:8282/deviseApi/rest/public/devises/convertir?montant=50&source=EUR&cible=USD renvoyant 
// {"montant":50.0,"source":"EUR","cible":"USD","montantConverti":56.215}
exports.apiRouter.route('/deviseApi/rest/public/devises/convertir').get(function (req, res, next) {
    var montant = req.query.montant;
    var source = req.query.source;
    var cible = req.query.cible;
    var changeSource;
    var changeCible;
    var resConv = new resConv_1.ResConv(montant, source, cible, 0);
    deviseService.findById(source)
        .then(function (deviseSource) {
        changeSource = deviseSource.tauxChange;
        return deviseService.findById(cible);
    })
        .then(function (deviseCible) {
        changeCible = deviseCible.tauxChange;
        resConv.montantConverti = montant * changeCible / changeSource;
        res.send(resConv);
    })
        .catch(function (err) { return next(err); });
});
// GET http://localhost:8282/deviseApi/rest/public/devises/EUR
// apidoc comment (npm install -g apidoc , apidoc -i dist/api/ -o apidoc/)
/**
 * @api {get} /deviseApi/rest/public/devises/:code Request Devise values by code
 * @apiName GetDeviseByCode
 * @apiGroup deviseApi
 *
 * @apiParam {String} code unique code of Devise (ex: EUR , USD, GBP , JPY)
 *
 * @apiSuccess {Object} devise devise values as json string
 * @apiUse DeviseStructure
 * @apiSuccessExample {json}  Success
 *    HTTP/1.1 200 OK
 *    {"code":"EUR","nom":"euro","change":1}
 * @apiErrorExample {json} List error
 *    HTTP/1.1 500 Internal Server Error
 *    HTTP/1.1 404 Not Found Error
 */
exports.apiRouter.route('/deviseApi/rest/public/devises/:code')
    .get(asyncToResp(function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var codeDevise, devise;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    codeDevise = req.params.code;
                    return [4 /*yield*/, deviseService.findById(codeDevise)];
                case 1:
                    devise = _a.sent();
                    return [2 /*return*/, devise];
            }
        });
    });
}));
/*.get( function(req :Request, res :Response , next: NextFunction ) {
     let codeDevise = req.params.numero;
     deviseService.findById(codeDevise)
       .then((devise)=> { res.send(devise) })
      .catch((err)=>{next(err);} );
});*/
//POST ... with body { "code": "M1" , "nom" : "monnaie1" , "change" : 1.123 }
exports.apiRouter.route('/deviseApi/rest/public/devises').post(function (req, res, next) {
    var devise = req.body; //as javascript object
    //deviseService.insert(devise)
    deviseService.saveOrUpdate(devise)
        .then(function (savedDevise) { res.send(savedDevise); })
        .catch(function (err) { return next(err); });
});
//PUT ... with body { "code": "USD" , "nom" : "dollar" , "change" : 1.1 }
exports.apiRouter.route('/deviseApi/rest/public/devises').put(function (req, res, next) {
    var devise = req.body; //as javascript object
    deviseService.update(devise)
        .then(function (updatedDevise) { res.send(updatedDevise); })
        .catch(function (err) { return next(err); });
});
// DELETE http://localhost:8282/deviseApi/rest/public/devises/EUR
exports.apiRouter.route('/deviseApi/rest/public/devises/:code')
    .delete(function (req, res, next) {
    var codeDevise = req.params.code;
    deviseService.deleteById(codeDevise)
        .then(function () { res.status(200).send({ "action": "devise with code=" + codeDevise + " was deleted" }); })
        .catch(function (err) { return next(err); });
});
// http://localhost:8282/deviseApi/rest/public/devises renvoyant tout [ {} , {}]
// http://localhost:8282/deviseApi/rest/public/devises?changeMini=1.1 renvoyant [{}] selon critere
exports.apiRouter.route('/deviseApi/rest/public/devises').get(function (req, res, next) {
    var changeMini = req.query.changeMini;
    deviseService.findAll()
        .then(function (deviseArray) {
        if (changeMini) {
            //filtrage selon critère changeMini:
            deviseArray = deviseArray.filter(function (dev) { return dev.tauxChange >= changeMini; });
        }
        res.send(deviseArray);
    })
        .catch(function (err) { return next(err); });
});
exports.apiRouter.route('/').get(function (req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.write("<html> <body>");
    res.write('<h3>index (developper page) of deviseApp</h3>');
    res.write('<a href="deviseApi/rest/public/devises/EUR">devise euro as Json string</a><br/>');
    res.write('<a href="deviseApi/rest/public/devises">toutes les devises (Json)</a><br/>');
    res.write('<a href="deviseApi/rest/public/devises?changeMini=1.1">devises avec change >= 1.1 (Json)</a><br/>');
    res.write('<a href="deviseApi/rest/public/devises/convertir?montant=50&source=EUR&cible=USD">convertir 50 euros en dollars</a><br/>');
    res.write('<p>utiliser POSTMAN ou autre pour tester en mode POST,PUT,DELETE</p>');
    res.write("</body></html>");
    res.end();
});

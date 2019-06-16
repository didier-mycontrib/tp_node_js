"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import * as http from 'http';
//var bodyParser = require('body-parser');
const bodyParser = __importStar(require("body-parser"));
const express_1 = __importDefault(require("express"));
const express_handlebars_1 = __importDefault(require("express-handlebars"));
const publicApiRoutes_1 = require("./api/publicApiRoutes");
const app = express_1.default();
app.engine('handlebars', express_handlebars_1.default());
app.set('view engine', 'handlebars');
//les routes en /html/... seront gérées par express
//par de simples renvois des fichiers statiques du répertoire "/html"
app.use('/html', express_1.default.static(__dirname + "/html"));
// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(publicApiRoutes_1.publicApiRouter); //delegate REST API routes to publicApiRouter
//app.use(privateApiRouter);
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', function (req, res) {
    res.redirect('/html/index.html');
});
app.get('/server-home', function (req, res) {
    res.render('server-home'); //rendering views/server-home.handlebars in the context of
    //views/layouts/main.handlebars
});
app.get('/calcul', function (req, res) {
    res.render('calcul'); //views/calcul.handlebars
});
//GET addition?a=5&b=6
app.get('/addition', function (req, res) {
    let va = Number(req.query.a); //req.param("a") ok but deprecated
    let vb = Number(req.query.b);
    doAddgetOrPost(va, vb, res);
});
//POST addition with body containing a=5&b=6 (application/x-www-form-urlencoded)
app.post('/addition', function (req, res) {
    let va = Number(req.body.a); //app.use(bodyParser.urlencoded()); is required 
    let vb = Number(req.body.b); //req.body.a and .b construct by bodyParser
    doAddgetOrPost(va, vb, res);
});
function doAddgetOrPost(va, vb, res) {
    let vaPlusVb = va + vb;
    res.render('addResult', { a: va,
        b: vb,
        resAdd: vaPlusVb });
    //rendering views/addResult.handlebars with js values for
    //{{a}} , {{b}} , {{resAdd}}
}
app.listen(8282, function () {
    console.log("http://localhost:8282");
});
exports.default = {
    'app': app
};

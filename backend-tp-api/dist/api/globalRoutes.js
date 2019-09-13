"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
//modules to load:
const express_1 = require("express");
const path = tslib_1.__importStar(require("path"));
exports.globalRouter = express_1.Router();
exports.globalRouter.route('/ngr/*')
    .get(function (req, res, next) {
    //send SPA index.html instead of virtual relative angular routes "/ngr/*"
    res.sendFile(path.join(__dirname, 'front-end/index.html'));
});
exports.globalRouter.route('/')
    .get(function (req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.write("<html> <header>");
    res.write('<meta http-equiv="refresh" content="0;URL=front-end/index.html">');
    res.write("</header> <body>");
    res.write("</body></html>");
    res.end();
});
exports.globalRouter.route('/test-ws')
    .get(function (req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.write("<html> <header>");
    res.write("</header> <body>");
    res.write('<p>test-ws for server.js (REST WS via nodeJs/express/mongoDB)</p>');
    res.write('<p><a href="news-api/public/publication"> liste des publications en JSON </a></p>');
    res.write("<br/>");
    res.write('<a href="auth-api/public/dev-only/get-secure-mode">get current secureMode (true or false)</a><br/>');
    res.write('<a href="auth-api/public/dev-only/set-secure-mode/true">set secureMode=true</a><br/>');
    res.write('<a href="auth-api/public/dev-only/set-secure-mode/false">set secureMode=false (dev-only)</a><br/>');
    res.write('<p><a href="login-api/private/role_admin/login"> liste des logins (pour admin seulement) </a></p>');
    res.write("<br/>");
    res.write('<a href="devise-api/public/devise/EUR">devise euro as Json string</a><br/>');
    res.write('<a href="devise-api/public/convert?source=EUR&target=USD&amount=200">convertir 200 euros en dollars</a><br/>');
    res.write('<a href="devise-api/public/devise">toutes les devises (Json)</a><br/>');
    res.write('<a href="devise-api/public/devise?changeMini=1.1">devises avec change >= 1.1 (Json)</a><br/>');
    res.write('<p>utiliser POSTMAN ou autre pour tester en mode POST,PUT,DELETE</p>');
    res.write("</body></html>");
    res.end();
});

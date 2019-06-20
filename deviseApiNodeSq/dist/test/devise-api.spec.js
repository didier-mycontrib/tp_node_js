"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = __importDefault(require("chai"));
var chai_http_1 = __importDefault(require("chai-http"));
var server_1 = require("../server");
var expect = chai_1.default.expect;
// Configure chai
chai_1.default.use(chai_http_1.default);
//chai.should();
describe("devise api", function () {
    before(function (done) {
        // runs before all tests :
        //insertion d'un jeu de données via http call:
        chai_1.default.request(server_1.app)
            .post('/deviseApi/rest/public/devises')
            .send({ code: "EUR", monnaie: "euro", tauxChange: 1 })
            .end(function (err, res) { done(); });
    });
    after(function () {
        // runs after all tests :
        server_1.server.close();
    });
    describe("getDeviseByCode", function () {
        it("returns status 200 and a devise object with good name", function (done) {
            chai_1.default.request(server_1.app)
                .get('/deviseApi/rest/public/devises/EUR')
                .end(function (err, res) {
                //res.should.have.status(200);
                chai_1.default.expect(res).status(200);
                var obj = res.body;
                //obj.should.be.a('object');
                chai_1.default.expect(obj).a('object');
                var devise = obj;
                //console.log(JSON.stringify(devise));
                chai_1.default.expect(devise.monnaie).equals("euro");
                done();
            });
        });
    });
});

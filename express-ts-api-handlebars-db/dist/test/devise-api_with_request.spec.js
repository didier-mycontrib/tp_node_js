"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const request_1 = __importDefault(require("request")); //no chai-http here
let expect = chai_1.default.expect;
describe("api devise / request", function () {
    var baseUrl = "http://localhost:8282/my-api/public/devise";
    describe("findAll devises", function () {
        let url = baseUrl;
        it("returns status 200", function (done) {
            request_1.default(url, function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                done(); //pour marquer la fin du test (réponse traitee apres appel asynchrone)
            });
        });
        it("returning at least 4 devises", function (done) {
            request_1.default(url, function (error, response, body) {
                //body here as raw json string
                let devises = JSON.parse(body);
                expect(devises.length).to.gte(4); //greater or equals
                done();
            });
        });
    });
    describe("findById devise", function () {
        let url = baseUrl + "/EUR";
        it("returns status 200", function (done) {
            request_1.default(url, function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });
        it("get good values for EUR", function (done) {
            request_1.default(url, function (error, response, body) {
                //body here as raw json string
                let deviseEUR = JSON.parse(body);
                expect(deviseEUR.name).to.equals("Euro");
                done();
            });
        });
    });
});

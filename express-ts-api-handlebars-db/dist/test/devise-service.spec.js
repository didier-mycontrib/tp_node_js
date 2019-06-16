"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const services_index_1 = require("../dao/services.index");
let expect = chai_1.default.expect;
describe("internal deviseService", function () {
    describe("getAllDevises", function () {
        it("returning at least 4 devises", async function () {
            let devises = await services_index_1.deviseDataService.findAll();
            expect(devises.length).to.gte(4); //greater or equals
        });
    });
});

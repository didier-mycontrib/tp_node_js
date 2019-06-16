import chai from 'chai';
import { deviseDataService } from "../dao/services.index";
import { Devise } from '../model/index.data';
let expect = chai.expect;

describe("internal deviseService", function() {
    
  describe("getAllDevises", function() {
    it("returning at least 4 devises", async function() {
      let devises: Devise[] = await deviseDataService.findAll();
      expect(devises.length).to.gte(4); //greater or equals
    });
  });

  

});
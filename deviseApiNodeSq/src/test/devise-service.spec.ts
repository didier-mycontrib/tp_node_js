import chai from 'chai'; 
import { DeviseDataService } from "../dao/devisedataService";
import { MemoryMapDeviseService } from "../dao/memoryMapDeviseService";
import { Devise, DeviseObject } from '../model/devise';
import { SqDeviseService } from '../dao/sqDeviseService';
import { sequelize } from '../model/global-db-model';
let expect = chai.expect;

//var deviseDataService : DeviseDataService =new MemoryMapDeviseService();
var deviseDataService : DeviseDataService =new SqDeviseService();

describe("internal deviseService", function() {

  before(function(done) {
    // runs before all tests :
    //insertion d'un jeu de données:
    sequelize.sync({logging: console.log})
			  .then(
				()=>{ 
              console.log("sequelize is initialized");
              deviseDataService.saveOrUpdate(new DeviseObject("EUR" , "euro" , 1))
              .then(()=>deviseDataService.saveOrUpdate(new DeviseObject("USD" , "dollar" , 1.1)))
              .then(()=>deviseDataService.saveOrUpdate(new DeviseObject("GBP" , "livre" , 0.9)))
              .then(()=>deviseDataService.saveOrUpdate(new DeviseObject("JPY" , "yen" , 132)))
              .then(()=>{done()});
            }
			  ).catch( (err:any) => { console.log('An error occurred :', err);  });
    
  });
    
  describe("getAllDevises", function() {
    it("returning at least 4 devises", async function() {
      let devises: Devise[] = await deviseDataService.findAll();
      expect(devises.length).to.gte(4); //greater or equals
    });
  });

  describe("getDeviseByCode", function() {
    it("euro for code EUR", async function() {
      let deviseEur: Devise = await deviseDataService.findById("EUR");
      //console.log(JSON.stringify(deviseEur));
      expect(deviseEur.monnaie).equals("euro");
    });
  });

  

});
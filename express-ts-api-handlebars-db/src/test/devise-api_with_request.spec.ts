import chai from 'chai';
import { Devise } from '../model/index.data';
import request from "request"; //no chai-http here
let expect = chai.expect;

describe("api devise / request", function() {

  var baseUrl = "http://localhost:8282/my-api/public/devise";
    
  describe("findAll devises", function() {

    let url =  baseUrl ;

    it("returns status 200", function(done) {
      request(url, function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();//pour marquer la fin du test (réponse traitee apres appel asynchrone)
      });
    });

    it("returning at least 4 devises", function(done) {
      request(url, function(error, response, body) {
        //body here as raw json string
        let devises = JSON.parse(body);
        expect(devises.length).to.gte(4); //greater or equals
        done();
      });
    });

  });  

  describe("findById devise", function() {

    let url =  baseUrl + "/EUR";

    it("returns status 200", function(done) {
      request(url, function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });

    it("get good values for EUR", function(done) {
      request(url, function(error, response, body) {
        //body here as raw json string
        let deviseEUR : Devise = JSON.parse(body);
        expect(deviseEUR.name).to.equals("Euro"); 
        done();
      });
    });

  });  

});
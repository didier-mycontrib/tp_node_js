var express = require('express');
var app = express();

//https://www.npmjs.com/package/soap
var soap = require('soap');

  var wsdlUrl = 'http://localhost:8282/calculateurFinancier?wsdl';
  var args = {montantHt: 200 , tauxTva : 20};
  soap.createClient(wsdlUrl, function(err, client) {
      client.calculerTva(args, function(err, result) {
          console.log(result);
      });
  });


// GET http://localhost:8585/essai1
app.get("/essai1", function(req, res,next) {
	var objData = {
		ref : "ref1",
		value : 12
	};
	res.send(objData);
});


app.listen(8585,function () {
	console.log("http://localhost:8585");
});

// node server.js
// ou bien 
// npm install nodeamon
// nodeamon server.js

//modules to load:
//var http = require('http'); 
//var url = require('url');
//var querystring = require('querystring')
//var EventEmitter = require('events').EventEmitter;
var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

//express framework manage basic route in server side with app.get() , app.post() , app.delete() , ...

app.get('/minibank', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.write("<html> <body>");
	res.write('index (welcome page) of minibank');
	res.write("</body></html>");
	res.end();
});


// listeComptes =new Array(); //with index from 0 to length-1
var listeComptes = {}; //empty map
//listeComptes[1]={numero : 1,label : "compte 1 (courant)",solde : 600.0};
//listeComptes[2]={numero : 2,label : "compte 2 (codevi)",solde : 200.0};

var mapAsArray = function (map){
	var a = new Array();
    for(var e in map){
		a.push(map[e]);
	}
return a;	
};


var findComptes  = function(db) {
   var cursor = db.collection('comptes').find();
    cursor.each(function(err, cpt) {
	  assert.equal(null, err);
      if (cpt != null) {
         console.log("cpt="+JSON.stringify(cpt));
		 listeComptes[Number(cpt.numero)]=cpt;
      } else {
         db.close();
      }
   });
};

var dbUrl = 'mongodb://localhost:27017/test';
MongoClient.connect(dbUrl, function(err, db) {
  if(err!=null) {
	  console.log("mongoDb connection error = " + err);
  }
  assert.equal(null, err);
  console.log("Connected correctly to mongodb database" );
  findComptes(db);
  //db.close();
});



// GET (array) /minibank/comptes?numClient=1
app.get('/minibank/comptes', function(req, res) {
	numClient = req.query.numClient;
	console.log("comptes pour numClient=" + numClient);
    res.setHeader('Content-Type', 'application/json');
	res.write(JSON.stringify(mapAsArray(listeComptes)));
	res.end();
});
// GET /minibank/comptes/1
app.get('/minibank/comptes/:numero', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
	numCpt = req.params.numero;
	cptJsonString = JSON.stringify(listeComptes[numCpt]);
    res.write(cptJsonString);
	res.end();
});

app.listen(8282 , function () {
  console.log("minibank rest server listening at 8282");
});
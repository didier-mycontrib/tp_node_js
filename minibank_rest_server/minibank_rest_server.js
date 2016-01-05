//modules to load:
//var http = require('http'); 
//var url = require('url');
//var querystring = require('querystring')
//var EventEmitter = require('events').EventEmitter;
var express = require('express');
var app = express();
var minibankDao = require('./minibank_dao_module');
//var assert = require('assert');

//express framework manage basic route in server side with app.get() , app.post() , app.delete() , ...

// CORS enabled with express/node-js :
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/minibank', function(req, res , next) {
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

listeComptes = minibankDao.loadAllComptes();

// GET (array) /minibank/comptes?numClient=1
app.get('/minibank/comptes', function(req, res,next) {
	numClient = req.query.numClient;
	console.log("comptes pour numClient=" + numClient);
    res.setHeader('Content-Type', 'application/json');
	res.write(JSON.stringify(mapAsArray(listeComptes)));
	res.end();
});
// GET /minibank/comptes/1
app.get('/minibank/comptes/:numero', function(req, res,next) {
    res.setHeader('Content-Type', 'application/json');
	numCpt = req.params.numero;
	cptJsonString = JSON.stringify(listeComptes[numCpt]);
    res.write(cptJsonString);
	res.end();
});

app.listen(8282 , function () {
  console.log("minibank rest server listening at 8282");
});
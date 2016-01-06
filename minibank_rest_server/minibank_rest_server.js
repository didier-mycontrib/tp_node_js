//modules to load:
//var http = require('http'); 
//var url = require('url');
//var querystring = require('querystring')
//var EventEmitter = require('events').EventEmitter;
var express = require('express');
var app = express();
var minibankDaoModule = require('./minibank_dao_module');
var minibankDAO = new minibankDaoModule.MinibankDAO();
var assert = require('assert');

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


// GET (array) /minibank/operations?numCpt=1
app.get('/minibank/operations', function(req, res,next) {
	sendGenericJsonExpressResponse('operations', { 'compte' : Number(req.query.numCpt) },res);	
});

// GET /minibank/comptes/1
app.get('/minibank/comptes/:numero', function(req, res,next) {
	sendGenericJsonExpressResponse('comptes', { '_id' : Number(req.params.numero) },res);
});

// GET /minibank/clients/1
app.get('/minibank/clients/:numero', function(req, res,next) {
    sendGenericJsonExpressResponse('clients', { '_id' : Number(req.params.numero) },res);
});

var sendGenericJsonExpressResponse = function(collectionName,query,res){
	res.setHeader('Content-Type', 'application/json');
	minibankDAO.genericFind(collectionName,query,onResultReady);
	function onResultReady(err,jsObject){
		res.write(JSON.stringify(jsObject));
	    res.end();
	}
}

// GET (array) /minibank/comptes?numClient=1
app.get('/minibank/comptes', function(req, res,next) {
	var numClient = req.query.numClient;
	console.log("comptes pour numClient=" + numClient);
    res.setHeader('Content-Type', 'application/json');
	minibankDAO.findComptesOfClient(numClient,onArrayResultReady);
	function onArrayResultReady(err,listeComptes){
		res.write(JSON.stringify(listeComptes));
	    res.end();
	}	
});


app.listen(8282 , function () {
  console.log("minibank rest server listening at 8282");
});
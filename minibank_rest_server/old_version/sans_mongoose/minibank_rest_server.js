﻿//modules to load:
//var http = require('http'); 
//var url = require('url');
//var querystring = require('querystring')
//var EventEmitter = require('events').EventEmitter;
var express = require('express');
var app = express();
var minibankDaoModule = require('./minibank_dao_module');
var minibankDAO = new minibankDaoModule.MinibankDAO();
var assert = require('assert');
var Q = require('q');

//express framework manage basic route in server side with app.get() , app.post() , app.delete() , ...

app.use(express.bodyParser()); //to parse JSON input data (req.body)

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

// POST /minibank/verifyAuth
app.post('/minibank/verifyAuth', function(req, res,next) {
	var verifAuth = req.body; // JSON input data with ok = null
	console.log("verifAuth :" +JSON.stringify(verifAuth)); 
    if(verifAuth.password == ("pwd" + verifAuth.numClient) )
		verifAuth.ok= true;	
	else
		verifAuth.ok= false;	
    res.send(verifAuth);    // send  back with ok = true or false
});

// POST /minibank/virement
app.post('/minibank/virement', function(req, res,next) {
	var ordreVirement = req.body; // JSON input data with ok = null
	console.log("ordreVirement :" +JSON.stringify(ordreVirement));

    Q().then(loadCpt(Number(ordreVirement.numCptDeb)))
    .then(updateCpt("debiter",Number(ordreVirement.montant)))
    .then(console.log)
    .catch(console.log);
	
	Q().then(loadCpt(Number(ordreVirement.numCptCred)))
    .then(updateCpt("crediter",Number(ordreVirement.montant)))
    .then(console.log)
    .catch(console.log);
 
	 function loadCpt(numCpt){	 //wrapper function around function pour promesse avec argument spécifique (lors de then(...))
		 return function(){
			var deferred = Q.defer();		
			minibankDAO.genericFindById('comptes' , { '_id' : numCpt } ,deferred.makeNodeResolver());
			return deferred.promise;
		  }
	 }
	 function updateCpt(debiterOuCrediter,montant){	 //wrapper function around function pour promesse avec argument spécifique (lors de then(...))
		return	function (cpt){
			var deferred = Q.defer();
			nouveauSolde = cpt.solde;
			if(debiterOuCrediter=="debiter"){
				nouveauSolde -=  montant; coeff= -1;
			}
			if(debiterOuCrediter=="crediter"){
				nouveauSolde +=  montant; coeff= +1;
			}
			minibankDAO.genericUpdateOne('comptes',Number(cpt._id) , { 'solde' : nouveauSolde }, function(err,results){
				if(err)  deferred.reject(err);
			});
			var newOperation = {"compte" : cpt._id ,"label" : debiterOuCrediter +" (virement)","montant" : montant * coeff,"dateOp" : currentDate()};
			minibankDAO.genericInsertOne('operations',newOperation, function(err,newId){
				if(err)  deferred.reject(err);
				else deferred.resolve("new operation inserted with _id=" + newId );
			});
			return deferred.promise;
		}
	 }
	
	
	
    if(true) // !!!  PEAUFINER ULTERIEUREMENT LES REMONTEES d'ERREURS !!!!
		ordreVirement.ok= true;	
	else
		ordreVirement.ok= false;	
    res.send(ordreVirement);    // send  back with ok = true or false
});



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

function currentDate(){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(dd<10) {
		dd='0'+dd
	} 

	if(mm<10) {
		mm='0'+mm
	} 

	today = yyyy + "-" + mm + "-" + dd;
	return today;
}
//modules to load:
//var http = require('http'); 
//var url = require('url');
//var querystring = require('querystring')
//var EventEmitter = require('events').EventEmitter;
var express = require('express');
var bodyParser = require('body-parser'); //en complement pour express 4 
var app = express();

//var minibankDaoModule = require('./minibank_dao_module');
//var minibankDAO = new minibankDaoModule.MinibankDAO();
var myGenericMongoClient = require('./my_generic_mongo_client'); 

var assert = require('assert');
var Q = require('q');
var uuid = require('uuid'); //to generate a simple token

//express framework manage basic route in server side with app.get() , app.post() , app.delete() , ...


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

// CORS enabled with express/node-js :
/*
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
*/

//var secureMode = false;
var secureMode = true;

function extractAndVerifToken(authorizationHeader){
	
	if(secureMode==false) return true;
	/*else*/
	if(authorizationHeader!=null ){
		if(authorizationHeader.startsWith("Bearer")){
			var token = authorizationHeader.substring(7);
			console.log("extracted token:" + token);
			//code extremement simplifié ici:
			//idealement à comparer avec token stocké en cache (si uuid token)
			//ou bien tester validité avec token "jwt"
			if(token != null && token.length>0)
				return true ;
			 else 
				return false;
		}
		else 
			return false;
	}
	else 
		return false;
}

// verif bearer token in Authorization headers of request :
function verifTokenInHeaders(req, res, next) {		
  if( extractAndVerifToken(req.headers.authorization))
      next();
  else 
	  res.status(401).send(null);//401=Unautorized or 403=Forbidden
}

// display Authorization in request (with bearer token):
function displayHeaders(req, res, next) {
  //console.log(JSON.stringify(req.headers));
  var authorization = req.headers.authorization;
  console.log("Authorization: " + authorization);	
  next();  
}



app.get('/minibank', function(req, res , next) {
    res.setHeader('Content-Type', 'text/html');
    res.write("<html> <body>");
	res.write('index (welcome page) of minibank');
	res.write("</body></html>");
	res.end();
});


// GET (array) /minibank/operations?numCpt=1
app.get('/minibank/operations', function(req, res,next) {
	myGenericMongoClient.genericFindList('operations', { 'compte' : Number(req.query.numCpt) },
	          function(err,tabOperations){				
					 sendDataOrError(err,tabOperations,res); 
	          });	
});

// GET /minibank/comptes/1
app.get('/minibank/comptes/:numero', 
    displayHeaders,verifTokenInHeaders, 
    function(req, res,next) {
	myGenericMongoClient.genericFindOne('comptes', { '_id' : Number(req.params.numero) },
	          function(err,compte){
					 sendDataOrError(err,compte,res); 
	          });	
});

// GET /minibank/clients/1
app.get('/minibank/clients/:numero',
        displayHeaders,
		function(req, res,next) {
			myGenericMongoClient.genericFindOne('clients', 
			     { '_id' : Number(req.params.numero) },
	             /* anonymous callback function as lambda expression :*/
				 (err,client)=>{ sendDataOrError(err,client,res); }
				 );	
});

// POST /minibank/verifyAuth  {  "numClient" : 1 , "password" : "pwd1" }
app.post('/minibank/verifyAuth', function(req, res,next) {
	var verifAuth = req.body; // JSON input data as jsObject with ok = null
	console.log("verifAuth :" +JSON.stringify(verifAuth)); 
            if(verifAuth.password == ("pwd" + verifAuth.numClient) ){
		verifAuth.ok= true;	
		verifAuth.token=uuid.v4();
		//éventuelle transmission parallèle via champ "x-auth-token" :
		res.header("x-auth-token", verifAuth.token);
		//+stockage dans une map pour verif ulterieure : ....
		}
	else {
		verifAuth.ok= false;
		verifAuth.token = null;
	}		
    res.send(verifAuth);    // send  back with ok = true or false and token
});


function sendDataOrError(err,data,res){
	if(err==null) {
			if(data!=null) 
				res.send(data);
			else res.status(404).send(null);//not found
		}
		else res.status(500).send({error: err});//internal error (ex: mongo access)	 
}

/*
//fonction inutile car equivalente à res.send(jsObject) :
var sendGenericJsonExpressResponse = function(jsObject,res){
	res.setHeader('Content-Type', 'application/json');
	res.write(JSON.stringify(jsObject));
	res.end();
}
*/


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
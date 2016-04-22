//modules to load:
//var http = require('http'); 
//var url = require('url');
//var querystring = require('querystring')
//var EventEmitter = require('events').EventEmitter;
var express = require('express');

var app = express(); //version (partie) non sécurisée (public , en lecture seule) sur 8282

var passport = require('passport')
  , JwtBearerStrategy  = require('passport-http-jwt-bearer').Strategy;

var secureApp = express(); //version (partie) sécurisée (en mise à jour) sur 8383

var mongoose = require('mongoose');
var configDB = require('./app-config/database.js');
var Devise   = require('./mongoose-model/devise').Devise;
var User   = require('./mongoose-model/user').User;

var configPassport = require('./app-config/passport.js');

var morgan  = require("morgan"); //for login request
var jwt     = require("jsonwebtoken"); //json web token 
//var uuid = require('node-uuid'); //to generate a defaultSecretKey
var assert = require('assert');
var Q = require('q');

//var generatedSecretKey = uuid.v4();
//console.log("generatedSecretKey="+generatedSecretKey);
//var defaultSecretKey = '3b91a7d3-5d7c-424b-bb31-8381b92883b8';
//var secretKeyforHmac = Math.random().toString(36).replace(/[^a-z]+/g, '');//--> "iuvwtifkmrhpvi"
//console.log("secretKeyforHmac="+secretKeyforHmac);

var defaultSecretKey ='iuvwtifkmrhpvi'; 
var jwtSecretKey = process.env.JWT_SECRET_KEY | defaultSecretKey;

//express framework manage basic route in server side with app.get() , app.post() , app.delete() , ...

app.use(express.bodyParser()); //to parse JSON input data (req.body)
secureApp.use(express.bodyParser()); //to parse JSON or HTTP/HTML or ... input data (req.body , ...) , indispensable pour passport-js

 

// CORS enabled with express/node-js :
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS"); //default: GET, ...
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept , Authorization");
  next();
});


secureApp.use(morgan("dev"));
secureApp.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS"); //default: GET, ...
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept , Authorization"); // Authorization should be specified here !!
  next();
});



mongoose.connect(configDB.url); // connect to our MongoDB database

/* NB: pour securiser une API REST --> pas de cookie ni de session mais des TOKENS (JWT , ...) */

configPassport.configure(passport,jwtSecretKey); //configuration d'une stratégie selon module config/passport.js

secureApp.use(passport.initialize()); //indispensable pour passport-js


app.get('/devise', function(req, res , next) {
    res.setHeader('Content-Type', 'text/html');
    res.write("<html> <body>");
	res.write('index (welcome page) of devise');
	res.write("</body></html>");
	res.end();
});



// GET /devise/devises?code=EUR
// GET /devise/devises?name=euro
// GET /devise/devises --> all devises
app.get('/devise/devises', function(req, res,next) {
	if(req.query.code != null)
	   sendGenericJsonExpressArrayResponse('devises', { 'code' : req.query.code },res);	
   else if(req.query.name != null)
	   sendGenericJsonExpressArrayResponse('devises', { 'name' : req.query.name },res);
    else
		sendGenericJsonExpressArrayResponse('devises', { },res);
});

// GET /devise/devises/1
app.get('/devise/devises/:numero', function(req, res,next) {
	sendGenericJsonExpressSingleResponse('devises', { '_id' : Number(req.params.numero) },res);
});

// GET /devise/convert?amount=50&src=EUR&target=USD
app.get('/devise/convert', function(req, res,next) {
	var amount = Number( req.query.amount );
	var srcCode = req.query.src ; var srcExchange = null;
	var targetCode = req.query.target ; var targetExchange = null;
	//console.log('amount='+amount + ' , srcCode=' + srcCode + ' , targetCode=' + targetCode);
	Devise.findOne({ 'code' : srcCode },onSrcReady);
	Devise.findOne({ 'code' : targetCode },onTargetReady);
	function onSrcReady(err,jsObject){
		srcExchange = jsObject.exchange_rate;
		if(targetExchange!=null)
			onConvResultReady();
	}
	function onTargetReady(err,jsObject){
		targetExchange = jsObject.exchange_rate;
		if(srcExchange!=null)
			onConvResultReady();
	}
	function onConvResultReady(){
		var convResult = amount * targetExchange / srcExchange;
		//res.setHeader('Content-Type', 'application/json');
		res.setHeader('Content-Type', 'text/plain');
		//console.log('convResult='+convResult );
		res.write(convResult.toString());
	    res.end();
	}
});



var sendGenericJsonExpressSingleResponse = function(collectionName,query,res){
	res.setHeader('Content-Type', 'application/json');
	mongoose.model(collectionName).findOne(query,onResultReady);
	function onResultReady(err,jsObject){
		res.write(JSON.stringify(jsObject));
	    res.end();
	}
}

var sendGenericJsonExpressArrayResponse = function(collectionName,query,res){
	res.setHeader('Content-Type', 'application/json');
	mongoose.model(collectionName).find(query,onResultReady);
	function onResultReady(err,jsArrayObject){
		res.write(JSON.stringify(jsArrayObject));
	    res.end();
	}
}


 
 // /login
 secureApp.post('/login', function(req, res) {
	 console.log("login with username="+req.body.username + " and password=" + req.body.password);
   // User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
	User.findOne({username: req.body.username}, function(err, user) {
        if (err) {
            res.json({ok: false, msg: "Error occured: " + err });
        } else {
            if (user) {
				if(user.validPassword(req.body.password)){
					req.token=  jwt.sign(user.tokenPayload() , jwtSecretKey.toString() ,  {expiresIn: 3600 , issuer: 'devise_rest_server'} );	//expiresIn : 60 means in 60 s , issuer means émetterur	
					console.log("req.token created during login/authentication="+req.token);		
				    res.json({ ok: true, msg: user.username + " successfully authenticated", token: req.token }); 
				}
				else{
					 res.json({ok: false, msg: "Incorrect password" });
				}
            } else {
                res.json({ok: false, msg: "Incorrect username" });    
            }
        }
    });
});

/*
Remarque sur structure du token (JWT)
la partie payload/claim comportera généralement les champs "iat" (issue at time) , "iss" (issuer/emetteur) et "exp" (time d'expiration)
jwt.sign() ne fonctionne bien que si le premier paramètre est un objet (pas une string , pas de JSON.stringify())
                                  le troisième paramètre "options" est de type {expiresIn: 60, issuer: 'devise_rest_server'} (expiresIn 60 signifie dans 60 secondes)
*/


secureApp.post('/signin', function(req, res) {
	console.log("signin with username="+req.body.username +" and password=" + req.body.password +" and email=" + req.body.email);
    // User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
	User.findOne({username: req.body.username}, function(err, user) {
        if (err) {
            res.json({ok: false, msg: "Error occured: " + err});
        } else {
            if (user) {
                res.json({ ok: false, msg: "User already exists!"});
            } else {
                var newUser = new User();
				newUser.username = req.body.username;
                newUser.email = req.body.email;
                newUser.password = newUser.generateBcrypt12Hash(req.body.password); // req.body.password = pwd (client side) : en clair ou légèrement crypté via sha1 ou md5 ou ...
                newUser.save(function(err, user) {
					if(err){
						console.log("err:" + err);
						res.json({ok: false, msg: "cannot save newUser in database"});
					}
					else {
						req.token = jwt.sign(user.tokenPayload(), jwtSecretKey.toString() ,  {expiresIn: 3600, issuer: 'devise_rest_server'});
						console.log("req.token created during signin="+req.token);						
                        res.json({ok: true,msg: "new account " + user.username + " successfully created" , token: req.token });             
					}
                });
            }
        }
    });
});


/*

//ensureAuthorized REPLACED BY passport.authenticate('jwt-bearer', { session: false }) WITH passport-http-jwt-bearer

function ensureAuthorized(req, res, next) {
    var bearerToken; // beared signifie porteur en francais --> jeton portant/vehiculant une information
    var bearerHeader = req.headers["authorization"] 
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;  // ou bien recup via  req.body.token || req.query.token || req.headers['x-access-token']; ou ... ?
		
		
		jwt.verify(req.token, jwtSecretKey.toString(), function(err, decodedTokenPayload) {      
			  if (err) {
				 console.log("error when verifying token:"  + err.toString());
				 res.send(403);   
			  } else {
				// if everything is good, save decodedToken to request for use in other routes
				req.decodedTokenPayload = decodedTokenPayload;  
                console.log("successfully decoded token payload =" + JSON.stringify(req.decodedTokenPayload));			
				next();
			  }
			});
    } else {
        res.send(403);
    }
}
*/

secureApp.get('/simple_private_data', 
 passport.authenticate('jwt-bearer', { session: false }), //if authenticate fails --> return 401 / Unauthorized (by default) and the route stop here
 function(req, res) {
	   // If this function gets called, authentication was successful.
       // `req.user` contains the authenticated user.
        res.json({ ok: true,msg: req.user });
    });



// PUT /devise/devises
secureApp.put('/devise/devises' , passport.authenticate('jwt-bearer', { session: false }) , fctPutDevise); //returning 401/Unautorized when auth failulre
app.put('/devise/devises', fctPutDevise);  //ici en version parallèle non securisée pour Tp seulement (pas sur vrai projet)

function fctPutDevise(req, res,next) {
	var deviseToUpdate = req.body; // JSON input data (to update)
	console.log("devise to update :" +JSON.stringify(deviseToUpdate)); 
    Devise.findByIdAndUpdate( Number(deviseToUpdate._id),
	                          { "code" : deviseToUpdate.code,
							    "name" : deviseToUpdate.name,
								"exchange_rate" : Number(deviseToUpdate.exchange_rate)} /*changes*/,
								{ "new" : true } /* option to return updated data */, 
								callback_with_err_and_changedDevise);
	function callback_with_err_and_changedDevise(err,jsObject){
		if(err!=null)
			console.log("devise err :" +err); 
		else{
		  // console.log("updated devise :" +JSON.stringify(jsObject)); 
		  res.send(jsObject);    // send  back updated data
		}
	}
}

//affichage des execptions non gérées:
process.on('uncaughtException', function(err) {
    console.log('Uncaught Exception in node js app : ' + err);
});

app.listen(8282 , function () {
  console.log("devise unsecure rest server listening at 8282");
});

var port = process.env.PORT || 8383; //process.env.PORT correspond à la variable d'environnement PORT fixée au démarrage de l'appli nondeJs
secureApp.listen(port , function () {
  console.log("secure devise rest server listening at " + port);
});


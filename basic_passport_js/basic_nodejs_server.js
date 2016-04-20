//modules to load:
//var http = require('http'); 
//var url = require('url');
//var querystring = require('querystring')
//var EventEmitter = require('events').EventEmitter;
var express = require('express');

var app = express(); 

var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy; // only used in app-config/passport.js submodule

var flash  = require('connect-flash');  
  
var mongoose = require('mongoose');
var configDB = require('./app-config/database.js');
var configPassport = require('./app-config/passport.js');

var assert = require('assert');
var Q = require('q');

mongoose.connect(configDB.url); // connect to our MongoDB database

//express framework manage basic route in server side with app.get() , app.post() , app.delete() , ...


app.use('static' , express.static('public-static-files')); //une URL relative en static/f1.html renverra le fichier f1.html du répertoire "public-static-files"
app.set('view engine', 'ejs'); //EJS est un moteur de template de page HTML ressemblant à JSP de java (<%=jsVar%>) , jade est un moteur concurrent de syntaxe inspirée de "ruby"
//utilisation de EJS --> res.render('pageXy.ejs"); ou pageXy.ejs est recherchée dans le répertoire "views"

app.use(express.bodyParser()); //to parse JSON or HTTP/HTML or ... input data (req.body , ...) , indispensable pour passport-js

  
  
 
  //app.use(app.router); // obsolete config for old version of express
  
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'mySecretKey' })); // NB: express.session required cookieParser
  app.use(flash()); // facultatif: use connect-flash for flash messages (stored in session) , NB: flash required session

 
   
  app.use(passport.initialize()); //indispensable pour passport-js ( après éventuels "flash , express.session , express.cookieParser , ..." )
  app.use(passport.session()); // si session avec passport et après passport.initialize() // persistent login sessions
   


/*
// CORS enabled with express/node-js :
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS"); //default: GET, ...
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
*/


configPassport.configure(passport); //configuration d'une stratégie selon module config/passport.js

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  else
	  res.redirect('/login');
    // Return error content: res.jsonp(...) or redirect: res.redirect('/login')
}


app.get('/app', function(req, res , next) {
     res.redirect('/welcome');
});

app.get('/welcome', function(req, res , next) {
    res.setHeader('Content-Type', 'text/html');
    res.write("<html> <body>");
	res.write('<h3>index (welcome page) of nodejs app</h3>');
	
	res.write('<a href="login">explicit GET login as login-form (for acessing auth-space) </a> <br/>');
	res.write('<a href="auth-space">auth-space (via direct link and login-hook if necessary) </a> <br/>');
	res.write('<a href="auth-space2">auth-space2 (via direct link and login-hook if necessary) </a> <br/>');

	
	res.write("</body></html>");
	res.end();
});



//GET login (as login-form)
app.get('/login', function(req, res) {
	
    
	
	//res.sendfile('login.html', {root: __dirname }); // version "HTML"
	var message = req.flash('error');
	console.log("message=req.flash('error')="+ message); 
	res.render('login.ejs' , { message : message } ); //version avec <%=message%> dans views/login.ejs
});

//POST login (to verify username/password)
/* //V1 (sans "flash message" et sans redirection vers /login en cas d'echec)
app.post('/login',
  passport.authenticate('local'), //if authenticate fails --> return 401 / Unauthorized (by default) and the route stop here
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect('/auth-space');
  });
 */ 
  
  //V2 (avec "flash message" et redirection vers "/login" en cas d'echec):
  app.post('/login',
  passport.authenticate('local' , {failureRedirect: '/login', failureFlash: true }),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect('/auth-space');
  });
  
  app.get('/auth-space',   ensureAuthenticated,
  function(req, res , next) {
    res.setHeader('Content-Type', 'text/html');
    res.write("<html> <body>");
	res.write('<p>partie accessible apres authentification - username:' + req.user.username + '</p>');
	res.write('<a href="auth-space2"> vers partie 2 accessible apres authentification </a> <br/>');
	res.write('<hr/><a href="welcome"> back to welcome (without logout) </a> <br/>');
	res.write('<hr/><a href="logout"> logout (end of session) </a> <br/>');
	res.write("</body></html>");
	res.end();
});

app.get('/auth-space2',   ensureAuthenticated, 
  function(req, res , next) {
    res.setHeader('Content-Type', 'text/html');
    res.write("<html> <body>");
	res.write('<p>partie 2 accessible apres authentification - username:' + req.user.username + '</p>');
	res.write('<a href="auth-space"> vers partie 1 accessible apres authentification </a> <br/>');
	res.write('<hr/><a href="welcome"> back to welcome (without logout) </a> <br/>');
	res.write('<hr/><a href="logout"> logout (end of session) </a> <br/>');
	res.write("</body></html>");
	res.end();
});


app.get('/logout',  
  function(req, res , next) {
    req.logout();
	res.redirect('/login');
});






app.listen(8282 , function () {
  console.log("basic nodejs server listening at 8282");
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
//modules to load:
//var http = require('http'); 
//var url = require('url');
//var querystring = require('querystring')
//var EventEmitter = require('events').EventEmitter;
var express = require('express');
var app = express();
var deviseDaoModule = require('./devise_dao_module');
var deviseDAO = new deviseDaoModule.DeviseDAO();
var assert = require('assert');
var Q = require('q');

//express framework manage basic route in server side with app.get() , app.post() , app.delete() , ...

app.use(express.bodyParser()); //to parse JSON input data (req.body)

// CORS enabled with express/node-js :
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS"); //default: GET, ...
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


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
	   sendGenericJsonExpressResponse('devises', { 'code' : req.query.code },res);	
   else if(req.query.name != null)
	   sendGenericJsonExpressResponse('devises', { 'name' : req.query.name },res);
    else
		sendGenericJsonExpressResponse('devises', { },res);
});

// GET /devise/devises/1
app.get('/devise/devises/:numero', function(req, res,next) {
	sendGenericJsonExpressResponse('devises', { '_id' : Number(req.params.numero) },res);
});

// GET /devise/convert?amount=50&src=EUR&target=USD
app.get('/devise/convert', function(req, res,next) {
	var amount = Number( req.query.amount );
	var srcCode = req.query.src ; var srcExchange = null;
	var targetCode = req.query.target ; var targetExchange = null;
	//console.log('amount='+amount + ' , srcCode=' + srcCode + ' , targetCode=' + targetCode);
	deviseDAO.genericFind('devises', { 'code' : srcCode },onSrcReady);
	deviseDAO.genericFind('devises', { 'code' : targetCode },onTargetReady);
	function onSrcReady(err,jsObject){
		srcExchange = jsObject[0].exchange_rate;
		if(targetExchange!=null)
			onConvResultReady();
	}
	function onTargetReady(err,jsObject){
		targetExchange = jsObject[0].exchange_rate;
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



var sendGenericJsonExpressResponse = function(collectionName,query,res){
	res.setHeader('Content-Type', 'application/json');
	deviseDAO.genericFind(collectionName,query,onResultReady);
	function onResultReady(err,jsObject){
		res.write(JSON.stringify(jsObject));
	    res.end();
	}
}



// PUT /devise/devises
app.put('/devise/devises', function(req, res,next) {
	var deviseToUpdate = req.body; // JSON input data (to update)
	console.log("devise to update :" +JSON.stringify(deviseToUpdate)); 
    deviseDAO.genericUpdateOne('devises', Number(deviseToUpdate._id),
	                          { "code" : deviseToUpdate.code,
							    "name" : deviseToUpdate.name,
								"exchange_rate" : Number(deviseToUpdate.exchange_rate)},
								callback_with_err_and_changedDevise);
	function callback_with_err_and_changedDevise(err,jsObject){
		if(err!=null)
			console.log("devise err :" +err); 
		else{
		  // console.log("updated devise :" +JSON.stringify(jsObject)); 
		  res.send(jsObject);    // send  back updated data
		}
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
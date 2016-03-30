//modules to load:
//var http = require('http'); 
//var url = require('url');
//var querystring = require('querystring')
//var EventEmitter = require('events').EventEmitter;
var express = require('express');
var app = express();
var assert = require('assert');

//express framework manage basic route in server side with app.get() , app.post() , app.delete() , ...

app.use(express.bodyParser()); //to parse JSON input data (req.body)



app.get('/', function(req, res , next) {
    res.setHeader('Content-Type', 'text/html');
    res.write("<html> <body>");
	res.write('index (welcome page) of deviseApp');
	res.write("</body></html>");
	res.end();
});




// GET /devises/1?callback=parseResponse pour devise de codeDevise=1
// ou bien
// GET /devises/0?callback=parseResponse&nbDevises=3 pour liste des 3 premieres devises
app.get('/devises/:numero', function(req, res,next) {
	
	var numDevise = Number(req.params.numero) ;
	
	var paramNbDevises = Number(req.query.nbDevises);
	var jsonp_callback = req.query.callback;
	
	var jsDeviseEuro = {
		codeDevise : 1 ,
		nom : 'Euro' ,
		change : 1.12
	};
	
	var jsDeviseDollar = {
		codeDevise : 2,
		nom : 'Dollar' ,
		change : 1.0
	};
	
	var jsDeviseLivre = {
		codeDevise : 3 ,
		nom : 'Livre' ,
		change : 0.8
	};
	
	var jsDeviseYen = {
		codeDevise : 4,
		nom : 'Yen' ,
		change : 122
	};
	
	
	
	if(numDevise!=undefined && numDevise > 0){
		
		var jsDeviseObject = null;
		
		if(numDevise==1)
			jsDeviseObject = jsDeviseEuro;
		else if(numDevise==2)
			jsDeviseObject = jsDeviseDollar;
		else if(numDevise==3)
			jsDeviseObject = jsDeviseLivre;
		else if(numDevise==4)
			jsDeviseObject = jsDeviseYen;
		
		if(jsonp_callback!=null && jsonp_callback!=undefined){
			//res.setHeader('Content-Type', 'application/json');
			res.setHeader('Content-Type', 'application/javascript');
			res.write(jsonp_callback+"("+JSON.stringify(jsDeviseObject) + ");");
		}else {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(jsDeviseObject));
		}
	}
	else if(paramNbDevises!=undefined && paramNbDevises > 0){
		var jsDeviseList = new Array();
		if(paramNbDevises>=1)
			jsDeviseList[0] = jsDeviseEuro;
		if(paramNbDevises>=2)
			jsDeviseList[1] = jsDeviseDollar;
		if(paramNbDevises>=3)
			jsDeviseList[2] = jsDeviseLivre;
		if(paramNbDevises>=4)
			jsDeviseList[3] = jsDeviseYen;
		
		if(jsonp_callback!=null && jsonp_callback!=undefined){
			//res.setHeader('Content-Type', 'application/json');
			res.setHeader('Content-Type', 'application/javascript');
			res.write(jsonp_callback+"("+JSON.stringify(jsDeviseList) + ");");
		}else {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(jsDeviseList));
		}
	}else{
		res.setHeader('Content-Type', 'text/plain');
		res.write("numDevise="+numDevise + " et paramNbDevises="+paramNbDevises);
	}
	res.end();
});




app.listen(8282 , function () {
  console.log("devise jsonp server listening at 8282");
});

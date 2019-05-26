//modules to load:
var express = require('express');
var bodyParser = require('body-parser');
var myGenericMongoClient = require("./my_generic_mongo_client");
var myGenericRestExpressUtil = require("./my_generic_rest_express_util");


var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

/*
// (TEMPORAIRE) CORS enabled with express/node-js :
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});
*/

app.use(express.static('front-end'));


// à tester via postMan ou un équivalent 
// POST xyz/contacts { "nom" : "..." , "prenom" : "..." ,"email" : "..." , "objet" : "..." , "message" : "..."   }
app.post('/xyz/contact', function(req, res,next) {
var contact = req.body; // JSON input data as jsObject with ok = null
console.log("posting new contact :" +JSON.stringify(contact));
myGenericMongoClient.genericInsertOne("contacts",contact,
	function(err,newId){
					   contact._id=newId;
					   myGenericRestExpressUtil.sendDataOrError(err,contact,res);// send back contact with _id
				   });	
});

app.delete('/xyz/contact/:contactId', function(req, res,next) {
var contactId = req.params.contactId; 
console.log("deleting contact of _id=:" +contactId);
myGenericMongoClient.genericDeleteOneById("contacts",contactId ,
	    function(err,booleanResult){
			          if(booleanResult)
					      myGenericRestExpressUtil.sendStatusWithOrWithoutError(err,200,res);
					  else
						  myGenericRestExpressUtil.sendStatusWithOrWithoutError(err,500,res);//404 : NotFound or 500 : internal Error
				   });	
});

// http://localhost:8282/xyz/contact
app.get('/xyz/contact', 
function(req, res , next) {
		myGenericMongoClient.genericFindList("contacts", {} , 
                   function(err,tabContacts){
					   myGenericRestExpressUtil.sendDataOrError(err,tabContacts,res);
				   });					   
});

app.get('/', function(req, res , next) {
res.setHeader('Content-Type', 'text/html');
res.write("<html> <header>");
res.write('<meta http-equiv="refresh" content="0;URL=index.html">');
res.write("</header> <body>");
res.write("</body></html>");
res.end();
});

app.get('/test-ws', function(req, res , next) {
res.setHeader('Content-Type', 'text/html');
res.write("<html> <header>");
res.write("</header> <body>");
res.write('<p>test-ws for server.js (REST WS via nodeJs/express/mongoDB)</p>');
res.write('<p><a href="xyz/contact"> liste des contacts en JSON </a></p>');
res.write("</body></html>");
res.end();
});




app.listen(process.env.PORT , function () {
	myGenericMongoClient.setMongoDbName('test');
	myGenericMongoClient.setMongoDbUrl('mongodb://127.0.0.1:27017/test');
	myGenericMongoClient.executeInMongoDbConnection(
	function(currentDb){
		 console.log("connected to mongo database ");
	} );
    console.log("rest express node server listening at " + process.env.PORT);
});
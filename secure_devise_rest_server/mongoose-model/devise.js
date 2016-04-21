
// module mongoose-model/devise.json
//===============================

//var EventEmitter = require('events').EventEmitter;
//var MongoClient = require('mongodb').MongoClient;
//var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose');
//var assert = require('assert');



/*
set MONGO_HOME=C:\Program Files\MongoDB\Server\3.2
cd /d "%~dp0"
"%MONGO_HOME%\bin\mongoimport" --db test --collection devises --drop --file dataset/devises.json --jsonArray
pause
*/

/*

[
{
"_id" : 1 ,
"code" : "USD",
"name" : "dollar",
"exchange_rate" : 1.0
},
{
"_id" : 2 ,
"code" : "EUR",
"name" : "euro",
"exchange_rate" : 0.87719
},
{
"_id" : 3 ,
"code" : "GBP",
"name" : "livre",
"exchange_rate" :0.69961
},
{
"_id" : 4 ,
"code" : "JPY",
"name" : "yen",
"exchange_rate" : 112.203
}
]

*/



	  deviseSchema = mongoose.Schema({
		_id: Number ,
		code: String ,
		name: String ,
		exchange_rate: Number 
	});

	Devise = mongoose.model('devises', deviseSchema);
	/* (simple test)
	var dev1 = new Devise({ "_id" : 1 , "code": 'EUR' , "name" : 'euro' , "exchange_rate": 0.87881   });
	console.log(JSON.stringify(dev1)); 
	*/

		 

/**************** module exports ********************/

exports.Devise = Devise;

// to use like this:

//var mongoose = require('mongoose');
//var configDB = require('./app-config/database.js');
//var Devise   = require('./mongoose-model/devise').Devise;
//...
//mongoose.connect(configDB.url); // connect to our MongoDB database
//...
//Devise.findOne({ 'code': codeDevise }, function (err, user) { ... } );



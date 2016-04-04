
//Minibank DAO module (with MongoDB/MongoClient)
var EventEmitter = require('events').EventEmitter;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose');
var assert = require('assert');

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


/************ Mongoose shemas and Models (may be in a model module) **********************/

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
	 

/********************** MyMongoDbConnector ******************************/

function MyMongoDbConnector(dbUrl) {
  this.dbUrl = dbUrl;
  if(this.dbUrl == null) {	  
	  this.dbUrl = 'mongodb://localhost:27017/test' ; //by default
	  console.log("default dbUrl = " + this.dbUrl);
  }
  this.simpleConnect=myMongoDbConnectorConnect;
  this.initMongoose = myMongoDbConnectorMongooseInit;
}


var myMongoDbConnectorMongooseInit = function(){


this.mongooseDB = mongoose.connection;

this.mongooseDB.on('error', console.error);
this.mongooseDB.once('open', function() {
  
});

mongoose.connect(this.dbUrl);
}

//pour éventuelle utilisation parallèle sans mongoose:
var myMongoDbConnectorConnect = function(callback_with_db) {
 
  MongoClient.connect(this.dbUrl, function(err, db) {
	  if(err!=null) {
		  console.log("mongoDb connection error = " + err);
	  }
	  assert.equal(null, err);
	  //console.log("Connected correctly to mongodb database" );
	  callback_with_db(db); 
	});
}

var myDefaultGlobalMongoDbConnector = new MyMongoDbConnector();
//var myDefaultGlobalMongoDbConnector = new MyMongoDbConnector("mongodb://powerUser:myPwd@ds041494.mongolab.com:41494/my_mongo_db");
myDefaultGlobalMongoDbConnector.initMongoose();


/**********************  DeviseDAO ******************************/

function DeviseDAO(mongoDbConnector) {
  this.mongoDbConnector = mongoDbConnector;
  if(this.mongoDbConnector == null) {
     this.mongoDbConnector = myDefaultGlobalMongoDbConnector;	  
	 console.log("DeviseDAO initialized with default mongoDbConnector ");
  }
  this.genericFindList=genericFindList;
  this.genericFindById=genericFindById;
  this.genericFind=genericFind;
  this.genericUpdateOne=genericUpdateOne;
  this.genericInsertOne=genericInsertOne;
  this.genericInsertPersistentOne=genericInsertPersistentOne;
  
  /*
  this.findAllComptes = findAllComptes;
  this.findCompteById = findCompteById;
  this.findOperations=findOperations;
  this.findClientById=findClientById;
  */
}




var genericUpdateOne = function(collectionName,id,changes,callback_with_err_and_changedItem) {

mongoose.model(collectionName).findByIdAndUpdate(id, changes , function(err, changedItem) {
		  if(err!=null) {
		  console.log("genericUpdateOne error = " + err);
	      } 
		  console.log("changedItem="+JSON.stringify(changedItem));
		   callback_with_err_and_changedItem(err,changedItem);
		});

};

var genericInsertOne = function(collectionName,newOne,callback_with_err_and_newId) {
     this.mongoDbConnector.simpleConnect( function(db) {
	   db.collection(collectionName).insertOne( newOne , function(err, result) {
		  if(err!=null) {
		  console.log("genericInsertOne error = " + err);
		  newId=null;
	      } 
		  else {newId=newOne._id;
		  }
		  callback_with_err_and_newId(err,newId);
		  db.close();
		});
   });
};

var genericInsertPersistentOne = function(newPersistentOne,callback_with_err_and_newId) {
	newPersistentOne.save( function(err) {
		  if(err!=null) {
		  console.log("genericInsertPersistentOne error = " + err);
		  newId=null;
	      } 
		  else {newId=newPersistentOne._id;
		  }
		  callback_with_err_and_newId(err,newId);
		});
};

var genericFindList = function(collectionName,query,callback_with_err_and_array) {
     this.mongoDbConnector.simpleConnect( function(db) {
	   var cursor = db.collection(collectionName).find(query);
	   cursor.toArray(function(err, arr) {
		   //addAliasFieldInCollection(arr,"_id","numero");
		   callback_with_err_and_array(err,arr);
		   db.close();
		});
   });
};
/*
var findOperations = function(numCpt,callback_with_err_and_array_of_operations) {
   this.genericFindList('operations',{ 'compte' : Number(numCpt) },callback_with_err_and_array_of_operations);
};

var findAllComptes = function(callback_with_err_and_array_of_comptes) {
    this.genericFindList('comptes',{},callback_with_err_and_array_of_comptes);
};
*/

var genericFindById = function(collectionName,query, callback_with_err_and_item) {	  
		   mongoose.model(collectionName).findOne(query , function (err, item) {
			if(err!=null) {
			  console.log("genericFindById error = " + err);
			  }
			   
			   assert.equal(null, err); 
			   if(item!=null){
				// item.addIdAlias();	 //or item['numero']=item['_id'];//addAliasField 
				 //console.log("genericFindById with query  = " + JSON.stringify(query) + "and item=" +JSON.stringify(item) );
			   }
			   callback_with_err_and_item(err,item);
			});	  
};
/*
var findCompteById = function(numCpt, callback_with_err_and_compte) {
   this.genericFindById('comptes',{ '_id' : Number(numCpt) },callback_with_err_and_compte);
};

var findClientById = function(numCli, callback_with_err_and_client) {
   this.genericFindById('clients',{ '_id' : Number(numCli) },callback_with_err_and_client);
};
*/

var genericFind = function(collectionName,query,callback_with_err_and_object) {
	returnArray = true;
	for(var e in query){
		if (e == "_id"){
			returnArray = false;
		}
	}
	if(returnArray)
		return  this.genericFindList(collectionName,query,callback_with_err_and_object);
	else
		return  this.genericFindById(collectionName,query,callback_with_err_and_object);
}

/**************** util ********************/

var addAliasFieldInCollection = function(coll, fieldName,aliasName){
	 for(i=0;i<coll.length;i++){
		 var e= coll[i];
		e[aliasName]=e[fieldName];//( yourSchema.virtual('numero').get(function() { return this._id; }); with mongoose)
	}	
};

/**************** module exports ********************/

exports.DeviseDAO = DeviseDAO;



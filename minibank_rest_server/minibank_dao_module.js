
//Minibank DAO module (with MongoDB/MongoClient)
var EventEmitter = require('events').EventEmitter;
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

/********************** MyMongoDbConnector ******************************/

function MyMongoDbConnector(dbUrl) {
  this.dbUrl = dbUrl;
  if(this.dbUrl == null) {	  
	  this.dbUrl = 'mongodb://localhost:27017/test' ; //by default
	  console.log("default dbUrl = " + this.dbUrl);
  }
}

MyMongoDbConnector.prototype = new EventEmitter();

MyMongoDbConnector.prototype.connect = function() {
  var that = this;
  MongoClient.connect(this.dbUrl, function(err, db) {
	  if(err!=null) {
		  console.log("mongoDb connection error = " + err);
		  that.emit('error', err);
	  }
	  assert.equal(null, err);
	  console.log("Connected correctly to mongodb database" );
	  that.emit('connected', db); 
	});
	return this; //pour enchaîner .connect().on('ready',function(db){...});
}

var myDefaultGlobalMongoDbConnector = new MyMongoDbConnector();

/**********************  MinibankDAO ******************************/

function MinibankDAO(mongoDbConnector) {
  this.mongoDbConnector = mongoDbConnector;
  if(this.mongoDbConnector == null) {
     this.mongoDbConnector = myDefaultGlobalMongoDbConnector;	  
	 console.log("MinibankDAO initialized with default mongoDbConnector ");
  }
  this.findAllComptes = findAllComptes;
  this.findCompteById = findCompteById;
}

var findAllComptes = function(callback_with_err_and_array_of_comptes) {
   this.mongoDbConnector.connect().on('connected', function(db) {
	   var cursor = db.collection('comptes').find();
	   cursor.toArray(function(err, arr) {
		   addAliasFieldInCollection(arr,"_id","numero");
		   callback_with_err_and_array_of_comptes(err,arr);
		   //console.log("arrayComptes="+JSON.stringify(arr) + " before db.close()");
		   db.close();
		});
   });
};

var findCompteById = function(numCpt, callback_with_err_and_compte) {
   var query = { '_id' : Number(numCpt) };
   console.log("findCompteById with query  = " + JSON.stringify(query));
   this.mongoDbConnector.connect().on('connected', function(db) {
	   db.collection('comptes').findOne(query , function(err, item) {
		  if(err!=null) {
		  console.log("findCompteById error = " + err);
	      }
	       assert.equal(null, err); 
		   item['numero']=item['_id'];//addAliasField
		   callback_with_err_and_compte(err,item);
		   //console.log("compte="+JSON.stringify(item) + " before db.close()");
		   db.close();
		});
   });
};


/**************** util ********************/

var addAliasFieldInCollection = function(coll, fieldName,aliasName){
	 for(i=0;i<coll.length;i++){
		 var e= coll[i];
		e[aliasName]=e[fieldName];
	}	
};

/**************** module exports ********************/

exports.MinibankDAO = MinibankDAO;



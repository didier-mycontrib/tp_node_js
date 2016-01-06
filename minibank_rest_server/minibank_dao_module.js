
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
  this.simpleConnect=myMongoDbConnectorConnect;
}


var myMongoDbConnectorConnect = function(callback_with_db) {
  var that = this;
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

/**********************  MinibankDAO ******************************/

function MinibankDAO(mongoDbConnector) {
  this.mongoDbConnector = mongoDbConnector;
  if(this.mongoDbConnector == null) {
     this.mongoDbConnector = myDefaultGlobalMongoDbConnector;	  
	 console.log("MinibankDAO initialized with default mongoDbConnector ");
  }
  this.genericFindList=genericFindList;
  this.genericFindById=genericFindById;
  this.genericFind=genericFind;
  
  this.findComptesOfClient= findComptesOfClient;
  /*
  this.findAllComptes = findAllComptes;
  this.findCompteById = findCompteById;
  this.findOperations=findOperations;
  this.findClientById=findClientById;
  */
}



var findComptesOfClient = function(numCli , callback_with_err_and_array_of_comptes) {
	var queryClient = { '_id' : Number(numCli) };
	//console.log("findComptesOfClient with queryClient  = " + JSON.stringify(queryClient));
   this.mongoDbConnector.simpleConnect( function(db) {
	   var cursor = db.collection('clients').findOne(queryClient , function(err, cli) {
		  if(err!=null) {
		  console.log("findComptesOfClient error = " + err);
	      }
	       assert.equal(null, err); 
		   if(cli==null){
			    //console.log("findComptesOfClient with null client with numCli = " + numCli);
				callback_with_err_and_array_of_comptes(null,new Array());
				db.close();
		   }
		   else 
		   {
		   var nbSubLoad = 0;
		   for(i=0;i<cli.comptes.length;i++){
			   var numCpt = cli.comptes[i];
			   var queryCpt = { '_id' : Number(numCpt) };
			   //console.log("sub request findCompteById with queryCpt  = " + JSON.stringify(queryCpt));
			   db.collection('comptes').findOne(queryCpt , function(err, item) {
				   nbSubLoad++;
				   item['numero']=item['_id'];//addAliasField
				   cli.comptes[nbSubLoad-1]=item;
				   //console.log("compte="+JSON.stringify(item) + "in sub request with nbSubLoad=" + nbSubLoad);
				   if(nbSubLoad==cli.comptes.length){					
					   callback_with_err_and_array_of_comptes(null,cli.comptes);
					   db.close();
				   }
			   });
		   }
		   //console.log("cli="+JSON.stringify(cli) + " before db.close()");
		  //db.close() not before end of subRequest async loop
		   }
		});
   });
};

var genericFindList = function(collectionName,query,callback_with_err_and_array) {
     this.mongoDbConnector.simpleConnect( function(db) {
	   var cursor = db.collection(collectionName).find(query);
	   cursor.toArray(function(err, arr) {
		   addAliasFieldInCollection(arr,"_id","numero");
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
   //console.log("genericFindById with query  = " + JSON.stringify(query));
   this.mongoDbConnector.simpleConnect( function(db) {
	   db.collection(collectionName).findOne(query , function(err, item) {
		  if(err!=null) {
		  console.log("genericFindById error = " + err);
	      }
	       assert.equal(null, err); 
		   item['numero']=item['_id'];//addAliasField
		   callback_with_err_and_item(err,item);
		   //console.log("item="+JSON.stringify(item) + " before db.close()");
		   db.close();
		});
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
		e[aliasName]=e[fieldName];
	}	
};

/**************** module exports ********************/

exports.MinibankDAO = MinibankDAO;



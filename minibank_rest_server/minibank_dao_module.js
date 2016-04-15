
//Minibank DAO module (with MongoDB/MongoClient)
var EventEmitter = require('events').EventEmitter;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose');
var assert = require('assert');


/************ Mongoose shemas and Models (may be in a model module) **********************/

	  compteSchema = mongoose.Schema({
		_id: Number ,
		numero: Number ,
		label: String ,
		solde: Number 
	});
	compteSchema.methods.addIdAlias = function () { this.numero = this._id; }
  
	Compte = mongoose.model('comptes', compteSchema);
	/* (simple test)
	var cpt1 = new Compte({ "_id" : 1 , "label": 'compte 1' });
	console.log(JSON.stringify(cpt1)); 
	*/
	 clientSchema = mongoose.Schema({
		_id: Number ,
		numero: Number ,
		comptes : [ Number ] ,
		nom: String ,
		prenom: String,  
		adresse: { idAdr: Number , rue: String, codePostal: String , ville : String } ,
		telephone: String,  
		email: String
	});
	clientSchema.methods.addIdAlias = function () { this.numero = this._id; }
  
	Client = mongoose.model('clients', clientSchema);
	
	operationSchema = mongoose.Schema({
		numero: Number ,
		compte: Number ,
		label: String ,
		montant: String ,
		dateOp: Date 
	});//with _id of type "ObjectId" by default for enabled auto generated id when .save() !!!!
	operationSchema.methods.addIdAlias = function () { this.numero = this._id; }
  
	Operation = mongoose.model('operations', operationSchema);

/********************** MyMongoDbConnector ******************************/

function MyMongoDbConnector(dbUrl) {
  this.dbUrl = dbUrl;
  if(this.dbUrl == null) {	  
	  this.dbUrl = 'mongodb://127.0.0.1:27017/test' ; //by default (NB: 127.0.0.1 instead of localhost if no network)
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
  this.genericUpdateOne=genericUpdateOne;
  this.genericInsertOne=genericInsertOne;
  this.genericInsertPersistentOne=genericInsertPersistentOne;
  
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
				   item['numero']=item['_id'];//addAliasField ( yourSchema.virtual('numero').get(function() { return this._id; }); with mongoose)
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

var genericUpdateOne = function(collectionName,id,changes,callback_with_err_and_changedItem) {

mongoose.model(collectionName).findByIdAndUpdate(id, changes , { "new" : true }, function(err, changedItem) {
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
		   mongoose.model(collectionName).findOne(query , function (err, item) {
			if(err!=null) {
			  console.log("genericFindById error = " + err);
			  }
			   
			   assert.equal(null, err); 
			   if(item!=null){
				 item.addIdAlias();	 //or item['numero']=item['_id'];//addAliasField 
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

exports.MinibankDAO = MinibankDAO;



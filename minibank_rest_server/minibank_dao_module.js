
//Minibank DAO module (with MongoDB/MongoClient)

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');




// listeComptes =new Array(); //with index from 0 to length-1
//var listeComptes = {}; //empty map
//listeComptes[1]={numero : 1,label : "compte 1 (courant)",solde : 600.0};
//listeComptes[2]={numero : 2,label : "compte 2 (codevi)",solde : 200.0};

/*
var mapAsArray = function (map){
	var a = new Array();
    for(var e in map){
		a.push(map[e]);
	}
return a;	
};
*/

var addAliasFieldInCollection = function(coll, fieldName,aliasName){
	 for(i=0;i<coll.length;i++){
		 var e= coll[i];
		e[aliasName]=e[fieldName];
	}	
};


var findComptes  = function(db,arrayComptes) {
   var cursor = db.collection('comptes').find();
    cursor.each(function(err, cpt) {
	  assert.equal(null, err);
      if (cpt != null) {
         console.log("cpt="+JSON.stringify(cpt));
		 //listeComptes[Number(cpt._id)]=cpt;
		 arrayComptes.push(cpt);
      } else {
         db.close();
		 addAliasFieldInCollection(arrayComptes,"_id","numero");
      }
   });
};

var dbUrl = 'mongodb://localhost:27017/test';

var loadAllComptes = function () {
	
	var arrayComptes = new Array();
		
	MongoClient.connect(dbUrl, function(err, db) {
	  if(err!=null) {
		  console.log("mongoDb connection error = " + err);
	  }
	  assert.equal(null, err);
	  console.log("Connected correctly to mongodb database" );
	  findComptes(db, arrayComptes); //asynchrone !!!
	});
  
return arrayComptes;

};

exports.loadAllComptes = loadAllComptes;



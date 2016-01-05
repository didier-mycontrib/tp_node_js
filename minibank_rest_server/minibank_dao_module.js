
//Minibank DAO module (with MongoDB/MongoClient)

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');




// listeComptes =new Array(); //with index from 0 to length-1
var listeComptes = {}; //empty map
//listeComptes[1]={numero : 1,label : "compte 1 (courant)",solde : 600.0};
//listeComptes[2]={numero : 2,label : "compte 2 (codevi)",solde : 200.0};

var mapAsArray = function (map){
	var a = new Array();
    for(var e in map){
		a.push(map[e]);
	}
return a;	
};


var findComptes  = function(db) {
   var cursor = db.collection('comptes').find();
    cursor.each(function(err, cpt) {
	  assert.equal(null, err);
      if (cpt != null) {
         console.log("cpt="+JSON.stringify(cpt));
		 listeComptes[Number(cpt.numero)]=cpt;
      } else {
         db.close();
      }
   });
};

var dbUrl = 'mongodb://localhost:27017/test';

var loadAllComptes = function () {
MongoClient.connect(dbUrl, function(err, db) {
  if(err!=null) {
	  console.log("mongoDb connection error = " + err);
  }
  assert.equal(null, err);
  console.log("Connected correctly to mongodb database" );
  findComptes(db);
  //db.close();
});

return listeComptes;

};

exports.loadAllComptes = loadAllComptes;



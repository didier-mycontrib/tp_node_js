
// module mongoose-model/user.json
//===============================

//var EventEmitter = require('events').EventEmitter;
//var MongoClient = require('mongodb').MongoClient;
//var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose');
//var assert = require('assert');

var bcrypt   = require('bcrypt-nodejs');

/*
set MONGO_HOME=C:\Program Files\MongoDB\Server\3.2
cd /d "%~dp0"
"%MONGO_HOME%\bin\mongoimport" --db test --collection users --drop --file dataset/users.json --jsonArray
pause
*/

/*

[
{
"_id" : 1 ,
"username" : "user1",
"password" : "pwd1",
"email" : "user1@gmail.com"
},
{
"_id" : 2 ,
"username" : "user2",
"password" : "pwd2",
"email" : "user2@gmail.com"
}
]

*/


/************ Mongoose shemas and Models  **********************/

	  userSchema = mongoose.Schema({
		_id: Number ,
		username: String ,
		password: String ,
		email: String 
	});

		 
	 // methods ======================
	// generating a hash
	userSchema.methods.generateHash = function(password) {
		//var cryptedPwd = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null); // le salt généré par bcrypt.genSaltSync(10) n'est pas constant dans le temps mais bcrypt.compareSync() s'en accomode
		var cryptedPwd = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null); //pour stocker dans la base de données des mots de passe cryptés (fonctionne même si déjà crypté : double cryptage dans ce cas )
		console.log("password=" + password + " - cryptedPwd=" + cryptedPwd);
		return cryptedPwd;
	};

	// checking if password is valid
	userSchema.methods.validPassword = function(password) {
		var cryptedPwd = this.generateHash(this.password);
		return bcrypt.compareSync(password, cryptedPwd);
        //return bcrypt.compareSync(password, this.cryptedPwd); //si idealement stocké "crypté" en base
		//return (password == this.password); //si auncun cryptage
	};
	
	User = mongoose.model('users', userSchema);
	/* (simple test)
	var user1 = new User({ "_id" : 1 , "username": 'user1' , "password" : 'pwd' , "email": 'user1@gmail.com'  });
	console.log(JSON.stringify(user1)); 
	*/
	 

/**************** module exports ********************/

exports.User = User;

// to use like this:

//var mongoose = require('mongoose');
//var configDB = require('./app-config/database.js');
//var User   = require('./mongoose-model/user').User;
//...
//mongoose.connect(configDB.url); // connect to our MongoDB database
//...
//User.findOne({ 'username': username }, function (err, user) { ... } );


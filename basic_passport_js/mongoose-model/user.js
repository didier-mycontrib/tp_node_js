
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
"username" : "user0-3-4-n",
"password" : "bcrypt10(sha1(sha1(pwd0-3-4-n)+basic_salt))",
"email" : "user0-3-4-n@gmail.com"
},
{
"username" : "user1",
"password" : "pwd1",
"email" : "user1@gmail.com"
},
{
"username" : "user2",
"password" : "pwd2",
"email" : "user2@gmail.com"
}
]

*/


/************ Mongoose shemas and Models  **********************/

	  userSchema = mongoose.Schema({
		username: String ,
		password: String ,
		email: String 
	});

		 
	 // methods ======================
	// generating a hash
	userSchema.methods.generateBcrypt12Hash = function(password) {
		//var cryptedPwd = bcrypt.hashSync(password, bcrypt.genSaltSync(12), null); // le salt généré par bcrypt.genSaltSync(10) n'est pas constant dans le temps mais bcrypt.compareSync() s'en accomode
		var cryptedPwd = bcrypt.hashSync(password, bcrypt.genSaltSync(12), null); //pour stocker dans la base de données des mots de passe cryptés (fonctionne même si déjà crypté via SHA1 ou MD5 ou .... : double cryptage dans ce cas )
		console.log("password=" + password + " - bcrypted12Pwd=" + cryptedPwd);
		return cryptedPwd;
	};
	// checking if password is valid
	userSchema.methods.validPassword = function(password) {
        //return bcrypt.compareSync(password, this.password); //si idealement stocké "crypté" en base
		return (password == this.password); //si auncun cryptage ce qui est le cas pour (user1,pwd1) et (user2,pwd2)
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


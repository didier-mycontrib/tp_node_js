
// app-config/database.js
module.exports = {

    'url'       : 'mongodb://127.0.0.1:27017/test' , // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/dbName
    'local_url' : 'mongodb://127.0.0.1:27017/test' , 
	'remote_url': "mongodb://powerUser:myPwd@ds041494.mongolab.com:41494/my_mongo_db"
};
	 
//to use like this:

// var configDB = require('./app-config/database.js');
// ... (configDB.url)  
// mongoose.connect(configDB.url); // connect to our database



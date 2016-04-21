
// app-config/passport.js
//====================

// load all the things we need
var JwtBearerStrategy  = require('passport-http-jwt-bearer').Strategy;

// load up the user model
var User            = require('../mongoose-model/user').User;



function configure(passport,jwtSecretKey) {

    

    // ==================================================================
    // JwtBearerStrategy === strategy with JWT bearer token (header.payload.signature)
    // ==================================================================
	  passport.use( /* 'jwt-bearer' , */ new JwtBearerStrategy(  jwtSecretKey.toString(),
         function(token, done) {
		   console.log("JwtBearerStrategy : received token="+ JSON.stringify(token));
           User.findOne( { username: token.username }, function (err, user) {
             if (err) { return done(err); }//done(err) means exception (ex: no user database)
            if (!user) { return done(null, false); }//done(null , false , ...) means no error/exception but "failure in authentication"
            return done(null, user, token);//done (null,user) with authenticated user info (not false) means ok "sucessful authentication"
           });
        }
       ));
	  
	
	
	/*
	apres authentification réussie , req.user correspond à l'utilisateur authentifié (ex: req.user.username)
	req.logout(); res.redirect('/login'); pour se déconnecter explicitement
	req.isAuthenticated() pour savoir si l'utilisateur (en session) est déjà authentifié ou passport
	
	Lorsque l'on recurise une api REST via des jetons ==> pas de session et 
	*/

};


// expose the configure() function to our app using module.exports
module.exports.configure = configure;

// to use like this:

// var configDB = require('./app-config/database.js');
// var configPassport = require('./app-config/passport.js');

//...
//mongoose.connect(configDB.url); // connect to our database
//configPassport.configure(passport);

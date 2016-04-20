
// app-config/passport.js
//====================

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User            = require('../mongoose-model/user').User;



function configure(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
		console.log("passport.serializeUser called with user.id="+user.id +" user._id="+user._id + " user=" + user  );
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
			console.log("passport.deserializeUser called with id=" + id + " findById user =" + user );
            done(err, user);
        });
    });

    // ==================================================================
    // LOCAL === local strategy (username,password)
    // ==================================================================
	  passport.use( /* 'local' , */ new LocalStrategy(
	  function(username, password, done) {
		  console.log("passport js local stategy callback called with username=" + username + " and password=" + password);
		User.findOne({ username: username }, function (err, user) {
		  if (err) { return done(err);  } //done(err) means exception (ex: no user database)
		  if (!user) {
			return done(null, false, { message: 'Incorrect username.' }); //done(null , false , ...) means no error/exception but "failure in authentication"
		  }
		  if (!user.validPassword(password)) {
			return done(null, false, { message: 'Incorrect password.' });
		  }
		  return done(null, user); //done (null,user) with authenticated user info (not false) means ok "sucessful authentication"
		});
	  }
	));
	
	
	/*
	apres authentification réussie , req.user correspond à l'utilisateur authentifié (ex: req.user.username)
	req.logout(); res.redirect('/login'); pour se déconnecter explicitement
	req.isAuthenticated() pour savoir si l'utilisateur (en session) est déjà authentifié ou passport
	
	==> fonction utilitaire:
	
	function ensureAuthenticated(req, res, next) {
		if (req.isAuthenticated())
			return next();
		else
			res.redirect('/login');
            // Return error content: res.jsonp(...) or redirect: res.redirect('/login')
	}
	app.get('/auth-space',   ensureAuthenticated,  function(req, res , next) {.... } );
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

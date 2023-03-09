import express from 'express';
const apiRouter = express.Router();

import loginDao from './login-dao-mongoose.js';
var PersistentLoginModel = loginDao.ThisPersistentModel; //to use only for specific extra request (not in dao)

import jwtUtil from './jwt-util.js';

function statusCodeFromEx(ex){
	let status = 500;
	let error = ex?ex.error:null ; 
	switch(error){
		case "BAD_REQUEST" : status = 400; break;
		case "NOT_FOUND" : status = 404; break;
		//...
		case "CONFLICT" : status = 409; break;
		default: status = 500;
	}
	return status;
}

/*
Nouvelle convention d'URL :
http://localhost:8282/login-api/private/xyz en accès private (avec auth nécessaire)
http://localhost:8282/login-api/public/xyz en accès public (sans auth nécessaire)

et url secondaire (en //) login-api/private/role_admin/xyz pour compatibilité ancienne version
*/


//*******************************************

//exemple URL: http://localhost:8282/login-api/private/reinit
apiRouter.route('/login-api/private/reinit')
.get( async function(req , res  , next ) {
	try{
		let doneActionMessage = await loginDao.reinit_db();
		res.send(doneActionMessage);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    } 
});


//exemple URL: http://localhost:8282/login-api/public/login/user1
apiRouter.route(['/login-api/private/login/:username' ,
                 '/login-api/private/role_admin/login/:username'])
.get( async function(req , res  , next ) {
	var username = req.params.username;
	try{
		let login = await loginDao.findById( username);
		res.send(login);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    } 
});

//exemple URL: http://localhost:8282/login-api/public/login (returning all logins)
apiRouter.route(['/login-api/private/login' ,
                  '/login-api/private/role_admin/login' ])
.get( async function(req , res  , next ) {
	var criteria={};
	try{
		let logins = await loginDao.findByCriteria(criteria);
		res.send(logins);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    } 
});

// http://localhost:8282/login-api/private/login en mode post
// avec { "username" : "user3" , "password" : "pwduser3" , "roles" : "user" } dans req.body
apiRouter.route([ '/login-api/private/login',
                  '/login-api/private/role_admin/login'])
.post(async function(req , res  , next ) {
	var nouveauLogin = req.body;
	console.log("POST,nouveauLogin="+JSON.stringify(nouveauLogin));
	try{
		let savedlogin = await loginDao.save(nouveauLogin);
		res.send(savedlogin);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    }
});

//submitting authRequest (login) via post
//response = authResponse with token:
// http://localhost:8282/login-api/public/auth en mode post
// avec { "username" : "admin1" , "password" : "pwdadmin1" , "roles" : "admin" } dans req.body
apiRouter.route('/login-api/public/auth')
.post(async function(req , res  , next ) {
	let  authReq  =  req.body;
	let  authResponse  = {username : authReq.username ,
        status : null , message : null, 
        token : null , roles : null };
	console.log("POST,authReq="+JSON.stringify(authReq));
	try{
		let login = await loginDao.findById( authReq.username);
		if(login && login.password == authReq.password){
			let arrayUserRoles = login.roles.split(',');
        	let arrayAskedRoles = authReq.roles.split(',');
        	let okRoles=true;
        	for(let askedRole of arrayAskedRoles){
            	if(!arrayUserRoles.includes(askedRole))
              	 okRoles=false;
        	}
        	if(okRoles==true){
				authResponse.message="successful login";
				authResponse.roles=authReq.roles;
				authResponse.status=true;
				authResponse.token=jwtUtil.buildJwtToken(authReq.username,authReq.roles);
				res.send(authResponse);
			}else{
				authResponse.message="login failed (good username/password but no asked roles="+authReq.roles+")";
				authResponse.status=false;
				res.status(401).send(authResponse);
			}
		}else{
			authResponse.message="login failed (wrong password)";
			authResponse.status=false;
			res.status(401).send(authResponse);
		}
	
    } catch(ex){
		authResponse.message="login failed (wrong username)";
        authResponse.status=false;
	    res.status(401).send(authResponse);
    } 
});



// http://localhost:8282/login-api/private/login en mode PUT
// avec { "username" : "user3" , "password" : "pwduser3" , "roles" : "admin" } dans req.body
apiRouter.route([ '/login-api/private/login',
                  '/login-api/private/role_admin/login'])
.put( async function(req , res  , next ) {
	var newValueOfloginToUpdate = req.body;
	console.log("PUT,newValueOfloginToUpdate="+JSON.stringify(newValueOfloginToUpdate));
	try{
		let updatedlogin = await loginDao.updateOne(newValueOfloginToUpdate);
		res.send(updatedlogin);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    }
});


// http://localhost:8282/login-api/private/login/user1 en mode DELETE
apiRouter.route([ '/login-api/private/login/:username',
                  '/login-api/private/role_admin/login/:username'])
.delete( async function(req , res  , next ) {
	var username = req.params.username;
	console.log("DELETE,username="+username);
	try{
		let deleteActionMessage = await loginDao.deleteOne(username);
		res.send(deleteActionMessage);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    }
});


export  default { apiRouter };
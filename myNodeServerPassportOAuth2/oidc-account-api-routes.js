import express from 'express';
const apiRouter = express.Router();

import remoteOidc from './remote-oidc.js';
const remoteOidcUsers = new remoteOidc.RemoteOidcUsers();

//NB: en v1 , URL public et private , future V2 : URL private only


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
convention d'URL :
http://localhost:8282/account-api/private/xyz en accès private (avec auth nécessaire)
http://localhost:8282/account-api/public/xyz en accès public (sans auth nécessaire)
*/


//*******************************************


//exemple URL: http://localhost:8282/account-api/public/account/user1
apiRouter.route(['/account-api/private/account/:username' ,
                 '/account-api/public/account/:username'])
.get( async function(req , res  , next ) {
	var username = req.params.username;
	try{
		let user = await remoteOidcUsers.getUserByUsername(username);
		res.send(user);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    } 
});

//exemple URL: http://localhost:8282/account-api/public/account (returning all accounts)
apiRouter.route(['/account-api/private/account' , 
                 '/account-api/public/account'])
.get( async function(req , res  , next ) {
	//let criteria={};
	try{
		let users = await remoteOidcUsers.getUsers();
		//console.log("users : " + JSON.stringify(users));
		res.send(users);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    } 
});

//exemple URL: http://localhost:8282/account-api/public/group (returning all user groups)
apiRouter.route(['/account-api/private/group','/account-api/public/group'])
.get( async function(req , res  , next ) {
	//let criteria={};
	try{
		let groups = await remoteOidcUsers.getGroups();
		//console.log("groups : " + JSON.stringify(groups));
		res.send(groups);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    } 
});


// http://localhost:8282/account-api/private/account en mode post
// avec {"firstName":"joe","lastName":"Dalton","email":"joe.dalton@jail.com","username":"user4","groups":["user_of_myrealm"],"newPassword":"pwd4"} dans req.body
apiRouter.route([ '/account-api/private/account'  , '/account-api/public/account'])
.post(async function(req , res  , next ) {
	var nouveauMyOidcUser = req.body;
	console.log("POST,nouveauMyOidcUser="+JSON.stringify(nouveauMyOidcUser));
	try{
		await remoteOidcUsers.addUser(nouveauMyOidcUser);
		const savedMyOidcUser = await remoteOidcUsers.getUserByUsername(nouveauMyOidcUser.username);
		res.send(savedMyOidcUser);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    }
});



// http://localhost:8282/account-api/private/account en mode PUT
// avec {"firstName":"joe","lastName":"Dalton","email":"joe.dalton@jail.com","username":"user4","groups":["user_of_myrealm"],"newPassword":"pwd4"} dans req.body
apiRouter.route(['/account-api/private/account', '/account-api/public/account'])
.put( async function(req , res  , next ) {
	var newValueOfAccountToUpdate = req.body;
	console.log("PUT,newValueOfAccountToUpdate="+JSON.stringify(newValueOfAccountToUpdate));
	try{
		await remoteOidcUsers.updateUser(newValueOfAccountToUpdate);
		const updatedMyOidcUser = await remoteOidcUsers.getUserByUsername(newValueOfAccountToUpdate.username);
		res.send(updatedMyOidcUser);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    }
});


// http://localhost:8282/account-api/private/account/user1 en mode DELETE
apiRouter.route(['/account-api/private/account/:username',
                 '/account-api/public/account/:username'])
.delete( async function(req , res  , next ) {
	var username = req.params.username;
	console.log("DELETE,username="+username);
	try{
		let deleteActionMessage = await remoteOidcUsers.deleteUserByUsername(username);
		res.send(deleteActionMessage);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    }
});


export  default { apiRouter };
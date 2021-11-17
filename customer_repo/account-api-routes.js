var express = require('express');
const apiRouter = express.Router();

var accountDao = require('./account-dao-mongoose');
var PersistentCustomerModel = accountDao.ThisPersistentModel; //to use only for specific extra request (not in dao)


function statusCodeFromEx(ex){
	let status = 500;
	error = ex?ex.error:null ; 
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
http://localhost:8231/customer-api/xyz en accès par défaut private (avec auth nécessaire)
http://localhost:8231/customer-api/public-xyz en accès public (sans auth nécessaire)
*/


//exemple URL: http://localhost:8231/customer-api/account/usernameXy
apiRouter.route('/customer-api/account/:username')
.get( async function(req , res  , next ) {
	var username = req.params.username;
	try{
		let account = await accountDao.findById( username);
		res.send(account);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    } 
});

//exemple URL: http://localhost:8231/customer-api/account (returning all customer)
apiRouter.route('/customer-api/account')
.get( async function(req , res  , next ) {
	var criteria={};
	try{
		let customers = await accountDao.findByCriteria(criteria);
		res.send(customers);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    } 
});


// http://localhost:8231/customer-api/public-account en mode post
// avec {  "username" : "jeanAimare" , "password" : "pwd3" } dans req.body
apiRouter.route('/customer-api/public-account')
.post(async function(req , res  , next ) {
	var nouveauCompte = req.body;
	console.log("POST,nouveauCompte="+JSON.stringify(nouveauCompte));
	try{
		let savedAccount = await accountDao.save(nouveauCompte);
		res.send(savedAccount);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    }
});

// http://localhost:8231/customer-api/public-login en mode post
// avec {  "username" : "jeanAimare" , "password" : "pwd3" } dans req.body
apiRouter.route('/customer-api/public-login')
.post(async function(req , res  , next ) {
	let login = req.body;
	let username = login?login.username : null;
	console.log("POST login,compte à verifier="+JSON.stringify(login));
	try{
		let account = await accountDao.findById( username);
		if(account.password == login.password)
			res.send({username : username ,
       		          status : true ,
			           message : "successful login" });	
        else res.status(401).send({username : username ,
       		           status : false ,
			           message : "wrong password" });					   
    } catch(ex){
	    res.status(404).send({username : username ,
       		                  status : false ,
			                  message : "invalid username" });
    }
});



// http://localhost:8231/customer-api/account en mode PUT
// avec { "username" : "jeanAimare" , "password" : "pwdA" } dans req.body
apiRouter.route('/customer-api/account')
.put( async function(req , res  , next ) {
	var newValueOfAccountToUpdate = req.body;
	console.log("PUT,newValueOfAccountToUpdate="+JSON.stringify(newValueOfAccountToUpdate));
	try{
		let updatedAccount = await accountDao.updateOne(newValueOfAccountToUpdate);
		res.send(updatedAccount);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    }
});

//exemple URL: http://localhost:8231/customer-api/account/jeanAimare en mode DELETE
apiRouter.route('/customer-api/account/:username')
.delete( async function(req , res  , next ) {
	var username = req.params.username;
	console.log("DELETE,username="+username);
	try{
		let deleteActionMessage = await accountDao.deleteOne(username);
		res.send(deleteActionMessage);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    }
});

exports.apiRouter = apiRouter;
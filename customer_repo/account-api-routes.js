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



//exemple URL: http://localhost:8231/customer-api/private/authorized/account/usernameXy
apiRouter.route('/customer-api/private/authorized/account/:username')
.get( async function(req , res  , next ) {
	var username = req.params.username;
	try{
		let account = await accountDao.findById( username);
		res.send(account);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    } 
});

//exemple URL: http://localhost:8231/customer-api/private/authorized/account (returning all customer)
apiRouter.route('/customer-api/private/authorized/account')
.get( async function(req , res  , next ) {
	var criteria={};
	try{
		let customers = await accountDao.findByCriteria(criteria);
		res.send(customers);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    } 
});


// http://localhost:8231/customer-api/private/authorized/account en mode post
// avec {  "username" : "jeanAimare" , "password" : "pwd3" } dans req.body
apiRouter.route('/customer-api/private/authorized/account')
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



// http://localhost:8231/customer-api/private/authorized/account en mode PUT
// avec { "username" : "jeanAimare" , "password" : "pwdA" } dans req.body
apiRouter.route('/customer-api/private/authorized/account')
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

//exemple URL: http://localhost:8231/customer-api/private/authorized/account/jeanAimare en mode DELETE
apiRouter.route('/customer-api/private/authorized/account/:username')
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
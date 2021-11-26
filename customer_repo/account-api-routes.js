var express = require('express');
const apiRouter = express.Router();

var accountDao = require('./account-dao-mongoose');
var myGenericFetcher = require('./generic-http-fetcher');
//var FormData = require('form-data');
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
http://localhost:8231/customer-api/private/xyz en accès private (avec auth nécessaire)
http://localhost:8231/customer-api/public/xyz en accès public (sans auth nécessaire)
*/


//exemple URL: http://localhost:8231/customer-api/private/account/usernameXy
apiRouter.route('/customer-api/private/account/:username')
.get( async function(req , res  , next ) {
	var username = req.params.username;
	try{
		let account = await accountDao.findById( username);
		res.send(account);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    } 
});

//exemple URL: http://localhost:8231/customer-api/private/account (returning all customer)
apiRouter.route('/customer-api/private/account')
.get( async function(req , res  , next ) {
	var criteria={};
	try{
		let customers = await accountDao.findByCriteria(criteria);
		res.send(customers);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    } 
});


// http://localhost:8231/customer-api/public/account en mode post
// avec {  "username" : "jeanAimare" , "password" : "pwd3" } dans req.body
apiRouter.route('/customer-api/public/account')
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

//return Promise<token_or_null>
async function tryRetreiveKongOAuth2PluginToken(username){
	let token = null;
	try{
		//tentative de recupération de access_token depuis kong api-gateway et plugin oauth2
		let url = "https://xyz.mycompany.fun:8443/customer-api/private/oauth2/token";
		let mode = 'post';
		let inputData = {client_id : "CLIENT_ID_RESA",
			client_secret : "CLIENT_SECRET_RESA",
	        scope : "read write delete",
			grant_type : "password",
            authenticated_userid : username,
			provision_key : "my_not_generated_provision_key" }            
		token = await myGenericFetcher.myGenericJsonFetch(url,mode,inputData);
	}catch(e){
		console.log("cannot retreive KongOAuth2PluginToken");
	}
	return token;
}

// http://localhost:8231/customer-api/public/login en mode post
// avec {  "username" : "jeanAimare" , "password" : "pwd3" } dans req.body
apiRouter.route('/customer-api/public/login')
.post(async function(req , res  , next ) {
	let login = req.body;
	let username = login?login.username : null;
	console.log("POST login,compte à verifier="+JSON.stringify(login));
	try{
		let account = await accountDao.findById( username);
		if(account.password == login.password){
			let token = null;
			token = await tryRetreiveKongOAuth2PluginToken(username);
		
			res.send({username : username ,
       		          status : true ,
					  token : token,
			          message : "successful login" });	
		}
        else res.status(401).send({username : username ,
       		           status : false , token : null,
			           message : "wrong password" });					   
    } catch(ex){
	    res.status(404).send({username : username ,
       		                  status : false , token : null,
			                  message : "invalid username"});
    }
});

// http://localhost:8231/customer-api/public/fetch en mode get
apiRouter.route('/customer-api/public/fetch')
.get(async function(req , res  , next ) {
	/*
	Test1 (en mode get):
	let url = "http://data.fixer.io/api/latest?access_key=26ca93ee7fc19cbe0a423aaa27cab235" //ici avec api-key de didier
		//type de réponse attendue:
		{"success":true,"timestamp":1635959583,"base":"EUR","date":"2021-11-03",
		"rates":{"AED":4.254663,"AFN":105.467869,..., "EUR":1 , ...}}
	*/
	//Test2 (en mode post):
	let url = "http://localhost:8234/session-api/private/session";
	let mode = 'post';
	let inputData = {title:"titre_xy",date:"2022-01-10",
	                 startTime:"15:30",unitPrice:20,
                     description:"description ...",maxNbPlaces:200 }
	try{
		let responseData = await myGenericFetcher.myGenericJsonFetch(url,mode,inputData,{},{res:"none"});
		res.send(responseData);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    }
});


// http://localhost:8231/customer-api/private/account en mode PUT
// avec { "username" : "jeanAimare" , "password" : "pwdA" } dans req.body
apiRouter.route('/customer-api/private/account')
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
apiRouter.route('/customer-api/private/account/:username')
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
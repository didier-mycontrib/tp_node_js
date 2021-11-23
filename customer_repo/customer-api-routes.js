var express = require('express');
const apiRouter = express.Router();

var customerDao = require('./customer-dao-mongoose');
var accountDao = require('./account-dao-mongoose');

var PersistentCustomerModel = customerDao.ThisPersistentModel; //to use only for specific extra request (not in dao)


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

//exemple URL: http://localhost:8231/customer-api/private/reinit
apiRouter.route('/customer-api/private/reinit')
.get( async function(req , res  , next ) {
	try{
		let doneActionMessage1 = await customerDao.reinit_db();
		let doneActionMessage2 = await accountDao.reinit_db();
		res.send({ cutomerPart : doneActionMessage1 , accountPart : doneActionMessage2 } );
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    } 
});

//exemple URL: http://localhost:8231/customer-api/private/customer/618d54d5386fcff631470c76
apiRouter.route('/customer-api/private/customer/:id')
.get( async function(req , res  , next ) {
	var idcustomer = req.params.id; //Number(req.params.id);  in old v1
	try{
		let customer = await customerDao.findById( idcustomer);
		res.send(customer);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    } 
});

//exemple URL: http://localhost:8231/customer-api/private/customer (returning all customer)
//             http://localhost:8231/customer-api/private/customer?email=jean.bon@labas.fr
apiRouter.route('/customer-api/private/customer')
.get( async function(req , res  , next ) {
	var email = req.query.email;
	var criteria=email?{ email: email }:{};
	try{
		let customers = await customerDao.findByCriteria(criteria);
		res.send(customers);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    } 
});


// http://localhost:8130/customer-api/public/customer en mode post
// avec {  "firstName" : "jean" , "lastName" : "Aimare" , "username" : "jeanAimare"" , "birthDay" : "1977/03/21" ,  
//         "email" : "jean.aimare@labas.fr" , "mobilePhoneNumber" : "0601020304"} dans req.body
apiRouter.route('/customer-api/public/customer')
.post(async function(req , res  , next ) {
	var nouvellecustomer = req.body;
	console.log("POST,nouvellecustomer="+JSON.stringify(nouvellecustomer));
	try{
		let savedcustomer = await customerDao.save(nouvellecustomer);
		res.send(savedcustomer);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    }
});



// http://localhost:8231/customer-api/private/customer en mode PUT
// avec { "id" : "618d54d5386fcff631470c76" ,  "firstName" : "jeanJean" , "lastName" : "AiPlusQueMare" , "username" : "jeanAimare" , "birthDay" : "1977/08/22" ,  
//         "email" : "jean.aiPlusQueMare@labas.fr" , "mobilePhoneNumber" : "0601020304"} dans req.body
apiRouter.route('/customer-api/private/customer')
.put( async function(req , res  , next ) {
	var newValueOfcustomerToUpdate = req.body;
	console.log("PUT,newValueOfcustomerToUpdate="+JSON.stringify(newValueOfcustomerToUpdate));
	try{
		let updatedcustomer = await customerDao.updateOne(newValueOfcustomerToUpdate);
		res.send(updatedcustomer);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    }
});

//exemple URL: http://localhost:8231/customer-api/private/customer/618d54d5386fcff631470c76 en mode DELETE
apiRouter.route('/customer-api/private/customer/:id')
.delete( async function(req , res  , next ) {
	var idcustomer =  req.params.id; //Number(req.params.id);  in old v1
	console.log("DELETE,idcustomer="+idcustomer);
	try{
		let deleteActionMessage = await customerDao.deleteOne(idcustomer);
		res.send(deleteActionMessage);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    }
});

exports.apiRouter = apiRouter;
var express = require('express');
const apiRouter = express.Router();

var reservationDao = require('./reservation-dao-mongoose');
var sessionInfoDao = require('./sessionInfoWithResaStat-dao-mongoose');
var customerInfoDao = require('./customerInfo-dao-mongoose');
var PersistentReservationModel = reservationDao.ThisPersistentModel; //to use only for specific extra request (not in dao)


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
http://localhost:8232/reservation-api/private/xyz en accès private (avec auth nécessaire)
http://localhost:8232/reservation-api/public/xyz en accès public (sans auth nécessaire)
*/

//exemple URL: http://localhost:8232/reservation-api/private/reinit
apiRouter.route('/reservation-api/private/reinit')
.get( async function(req , res  , next ) {
	try{
		let doneActionMessage1 = await customerInfoDao.reinit_db();
		let doneActionMessage2 = await sessionInfoDao.reinit_db();
		let doneActionMessage3 = await reservationDao.reinit_db();
		res.send({ customerPart : doneActionMessage1 , sessionPart : doneActionMessage2 , reservationPart : doneActionMessage3 ,  } );
    }  catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    } 
});

//exemple URL: http://localhost:8232/reservation-api/private/reservation/618d647c42a5f45f95e13be5
apiRouter.route('/reservation-api/private/reservation/:id')
.get( async function(req , res  , next ) {
	var idreservation = req.params.id;
   
	//V2: with ad hoc function of dao (returning Promise)
	try{
		let reservation = await reservationDao.findById( idreservation);
		res.send(reservation);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    } 
});

//exemple URL: http://localhost:8232/reservation-api/private/reservation (returning all reservation)
//             http://localhost:8232/reservation-api/private/reservation?sessionId=618d53514e0720e69e2e54c8
//             http://localhost:8232/reservation-api/private/reservation?customerId=618d54d5386fcff631470c76
apiRouter.route('/reservation-api/private/reservation')
.get( async function(req , res  , next ) {
	let sessionId = req.query.sessionId;
	let customerId = req.query.customerId;
	let criteria=sessionId?{ session : sessionId }:(customerId?{ customer : customerId }:{});
	try{
		let reservations = await reservationDao.findByCriteria(criteria);
		res.send(reservations);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    } 
});


// http://localhost:8232/reservation-api/private/reservation en mode post
// avec { "datetime" : "2021-11-12 15:00:00.000" , "nbPlaces" : 3 } dans req.body
apiRouter.route('/reservation-api/private/reservation')
.post(async function(req , res  , next ) {
	var nouvellereservation = req.body;
	console.log("POST,nouvellereservation="+JSON.stringify(nouvellereservation));
	try{
		let savedreservation = await reservationDao.save(nouvellereservation);
		res.send(savedreservation);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    }
});



// http://localhost:8232/reservation-api/private/reservation en mode PUT
// avec { "id" : "618d647c42a5f45f95e13be5" , "datetime" : "2021-11-12 15:00:00.000" , "nbPlaces" : 6 } dans req.body
apiRouter.route('/reservation-api/private/reservation')
.put( async function(req , res  , next ) {
	var newValueOfreservationToUpdate = req.body;
	console.log("PUT,newValueOfreservationToUpdate="+JSON.stringify(newValueOfreservationToUpdate));
	try{
		let updatedreservation = await reservationDao.updateOne(newValueOfreservationToUpdate);
		res.send(updatedreservation);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    }
});

//exemple URL: http://localhost:8232/reservation-api/private/reservation/618d647c42a5f45f95e13be5 en mode DELETE
apiRouter.route('/reservation-api/private/reservation/:id')
.delete( async function(req , res  , next ) {
	var idreservation = req.params.id;
	console.log("DELETE,idreservation="+idreservation);
	try{
		let deleteActionMessage = await reservationDao.deleteOne(idreservation);
		res.send(deleteActionMessage);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    }
});

exports.apiRouter = apiRouter;
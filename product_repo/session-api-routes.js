var express = require('express');
const apiRouter = express.Router();

var sessionDao = require('./session-dao-mongoose');
var PersistentSessionModel = sessionDao.ThisPersistentModel; //to use only for specific extra request (not in dao)


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
http://localhost:8230/session-api/xyz en accès par défaut private (avec auth nécessaire)
http://localhost:8230/session-api/public-xyz en accès public (sans auth nécessaire)
*/

//exemple URL: http://localhost:8230/session-api/reinit
apiRouter.route('/session-api/reinit')
.get( async function(req , res  , next ) {
	try{
		let doneActionMessage = await sessionDao.reinit_db();
		res.send(doneActionMessage);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    } 
});

//exemple URL: http://localhost:8230/session-api/public-session/618d53514e0720e69e2e54c8
apiRouter.route('/session-api/public-session/:id')
.get( async function(req , res  , next ) {
	var idSession = req.params.id;//Number(req.params.id); in old v1 with auto_incr
   /*
   //V1 (direct use of mogoose PersistentSessionModel):
	PersistentSessionModel.findById(idSession ,	function(err,session){
			if(err || session==null)
			   res.status(404).send({err:'not found'});
			else
			  res.send(session);
    */
	//V2: with ad hoc function of dao (returning Promise)
	try{
		let session = await sessionDao.findById( idSession);
		res.send(session);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    } 
});

//exemple URL: http://localhost:8230/session-api/public-session (returning all session)
//             http://localhost:8230/session-api/public-session?titleLike=lafluteenchantee
apiRouter.route('/session-api/public-session')
.get( async function(req , res  , next ) {
	var titleLike = req.query.titleLike;
	/*
	let sEnBase64 = req.query.p; //récupération de ...?p=valeurEnBase64
	console.log("en base64 p="+sEnBase64);
	let strUrlEncoded=Buffer.from(sEnBase64, 'base64').toString();
	console.log("strUrlEncoded="+strUrlEncoded);
	let str = decodeURIComponent(strUrlEncoded); 
    console.log("str="+str);
	
	//si besoin encode urlEncoded coté nodeJs:
	let urlEncodedString = encodeURIComponent(str)
    console.log("urlEncodedString="+urlEncodedString);
	//si besoin encodage base64 du coté nodeJs:
	let s2EnBase64 = Buffer.from(urlEncodedString).toString('base64');
	console.log("s2EnBase64="+s2EnBase64);
	let str2UrlEncoded=Buffer.from(s2EnBase64, 'base64').toString();
	console.log("str2UrlEncoded="+str2UrlEncoded);
	let str2 = decodeURIComponent(str2UrlEncoded); 
    console.log("str2="+str2);
	*/
	
	//var criteria=title?{ title: title }:{};
	var criteria=titleLike?{ title: { $regex: titleLike } }:{};
	try{
		let sessions = await sessionDao.findByCriteria(criteria);
		res.send(sessions);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    } 
});


// http://localhost:8230/session-api/session en mode post
// avec {"title":"titre_xy","date":"2022-01-10","startTime":"15:30","unitPrice":20,
//       "description":"...","maxNbPlaces":200 } dans req.body
apiRouter.route('/session-api/session')
.post(async function(req , res  , next ) {
	var nouvelleSession = req.body;
	console.log("POST,nouvelleSession="+JSON.stringify(nouvelleSession));
	try{
		let savedSession = await sessionDao.save(nouvelleSession);
		res.send(savedSession);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    }
});



// http://localhost:8230/session-api/session en mode PUT
// avec { "id" : "618d53514e0720e69e2e54c8" , "title":"la flute tres enchantee","date":"2022-01-10","startTime":"15:30","unitPrice":20,
//       "description":"super opera de Mozart","maxNbPlaces":200 } dans req.body
apiRouter.route('/session-api/session')
.put( async function(req , res  , next ) {
	var newValueOfSessionToUpdate = req.body;
	console.log("PUT,newValueOfSessionToUpdate="+JSON.stringify(newValueOfSessionToUpdate));
	try{
		let updatedSession = await sessionDao.updateOne(newValueOfSessionToUpdate);
		res.send(updatedSession);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    }
});

//exemple URL: http://localhost:8230/session-api/session/618d53514e0720e69e2e54c8 en mode DELETE
apiRouter.route('/session-api/session/:id')
.delete( async function(req , res  , next ) {
	var idSession = req.params.id;//Number(req.params.id); in old v1 with auto_incr
	console.log("DELETE,idSession="+idSession);
	try{
		let deleteActionMessage = await sessionDao.deleteOne(idSession);
		res.send(deleteActionMessage);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    }
});

exports.apiRouter = apiRouter;
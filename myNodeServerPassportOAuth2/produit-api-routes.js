import express from 'express';
const apiRouter = express.Router();

import produitDao from './produit-dao-mongoose.js';
var PersistentProduitModel = produitDao.ThisPersistentModel; //to use only for specific extra request (not in dao)


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
http://localhost:8282/produit-api/private/xyz en accès private (avec auth nécessaire)
http://localhost:8282/produit-api/public/xyz en accès public (sans auth nécessaire)

et url secondaire (en //) produit-api/private/role_admin/xyz pour compatibilité ancienne version
*/


//*******************************************

//exemple URL: http://localhost:8282/produit-api/private/reinit
apiRouter.route('/produit-api/private/reinit')
.get( async function(req , res  , next ) {
	try{
		let doneActionMessage = await produitDao.reinit_db();
		res.send(doneActionMessage);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    } 
});


//exemple URL: http://localhost:8282/produit-api/public/produit/618d53514e0720e69e2e54c8
apiRouter.route('/produit-api/public/produit/:id')
.get( async function(req , res  , next ) {
	var idProduit = req.params.id;
	try{
		let Produit = await produitDao.findById( idProduit);
		res.send(Produit);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    } 
});

// exemple URL: http://localhost:8282/produit-api/public/produit
// returning all produits if no ?prixMini
// http://localhost:8282/produit-api/public/produit?prixMini=1.05
apiRouter.route('/produit-api/public/produit')
.get( async function(req , res  , next ) {
	var prixMini = req.query.prixMini;
	//var criteria=title?{ title: title }:{};
	var criteria=prixMini?{ prix: { $gte : prixMini } }:{};
	try{
		let produits = await produitDao.findByCriteria(criteria);
		res.send(produits);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    } 
});


// http://localhost:8282/produit-api/private/produit en mode post
// avec { "id" : null , "nom" : "produitXy" , "prix" : 12.3 }
//ou bien { "nom" : "produitXy" , "prix" : 12.3 } dans req.body
apiRouter.route([ '/produit-api/private/produit',
                  '/produit-api/private/role_admin/produit'])
.post(async function(req , res  , next ) {
	var nouveauProduit = req.body;
	console.log("POST,nouveauProduit="+JSON.stringify(nouveauProduit));
	try{
		let savedProduit = await produitDao.save(nouveauProduit);
		res.send(savedProduit);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    }
});



// http://localhost:8282/produit-api/private/produit en mode PUT
// avec { "code" : "618d53514e0720e69e2e54c8" , "nom" : "produit_xy" , "prix" : 16.3 } dans req.body
apiRouter.route([ '/produit-api/private/produit',
                  '/produit-api/private/role_admin/produit'])
.put( async function(req , res  , next ) {
	var newValueOfProduitToUpdate = req.body;
	console.log("PUT,newValueOfProduitToUpdate="+JSON.stringify(newValueOfProduitToUpdate));
	try{
		let updatedProduit = await produitDao.updateOne(newValueOfProduitToUpdate);
		res.send(updatedProduit);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    }
});


// http://localhost:8282/produit-api/private/produit/618d53514e0720e69e2e54c8 en mode DELETE
apiRouter.route([ '/produit-api/private/produit/:id',
                  '/produit-api/private/role_admin/produit/:id'])
.delete( async function(req , res  , next ) {
	var idProduit = req.params.id;
	console.log("DELETE,idProduit="+idProduit);
	try{
		let deleteActionMessage = await produitDao.deleteOne(idProduit);
		res.send(deleteActionMessage);
    } catch(ex){
	    res.status(statusCodeFromEx(ex)).send(ex);
    }
});

export  default { apiRouter };
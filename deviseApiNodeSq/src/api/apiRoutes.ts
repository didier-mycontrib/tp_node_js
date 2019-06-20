import { Request, Response ,NextFunction, Router} from 'express';
import { Devise } from '../model/devise';
//import { ErrorWithStatus , NotFoundError, ConflictError} from '../error/errorWithStatus'
import { MemoryMapDeviseService } from '../dao/memoryMapDeviseService';
import { SqDeviseService } from '../dao/sqDeviseService';
import { DeviseDataService } from '../dao/deviseDataService';
import { ResConv } from './dto/resConv';

export const apiRouter = Router();

//var  deviseService : DeviseDataService = new MemoryMapDeviseService();
var  deviseService : DeviseDataService = new SqDeviseService();

function asyncToResp(fn : Function) {
    return function(req :Request, res :Response , next: NextFunction) {
      // Make sure to `.catch()` any errors and pass them along to the `next()`
      // middleware in the chain, in this case the error handler.
      fn(req, res, next)
      .then((data:object)=> { res.send(data) })
      .catch(next);
    };
  }

/**
 * @apidefine DeviseStructure
 * @apiSuccess {String} devise.code code of Devise (ex: EUR , USD, GBP , JPY, ...)
 * @apiSuccess {String} devise.monnaie  name of Devise (ex: euro , dollar , livre , yen)
 * @apiSuccess {Number} devise.tauxChange  change for 1 euro.
 */

// http://http://localhost:8282/deviseApi/rest/public/devises/convertir?montant=50&source=EUR&cible=USD renvoyant 
// {"montant":50.0,"source":"EUR","cible":"USD","montantConverti":56.215}
apiRouter.route('/deviseApi/rest/public/devises/convertir').get(function(req :Request, res :Response , next: NextFunction ) {
    const  montant = req.query.montant;
    const  source = req.query.source;
    const  cible = req.query.cible;
    let changeSource : number ;
    let changeCible : number ;
    const resConv = new ResConv(montant,source,cible,0);
    deviseService.findById(source)
    .then((deviseSource)=> { changeSource = deviseSource.tauxChange;
                             return deviseService.findById(cible)
                           })
    .then((deviseCible)=> { changeCible = deviseCible.tauxChange;
                            resConv.montantConverti = montant * changeCible / changeSource;
                          res.send(resConv);
                          })
    .catch((err)=>next(err));
});


// GET http://localhost:8282/deviseApi/rest/public/devises/EUR
// apidoc comment (npm install -g apidoc , apidoc -i dist/api/ -o apidoc/)
/**
 * @api {get} /deviseApi/rest/public/devises/:code Request Devise values by code
 * @apiName GetDeviseByCode
 * @apiGroup deviseApi
 *
 * @apiParam {String} code unique code of Devise (ex: EUR , USD, GBP , JPY)
 *
 * @apiSuccess {Object} devise devise values as json string
 * @apiUse DeviseStructure
 * @apiSuccessExample {json}  Success
 *    HTTP/1.1 200 OK
 *    {"code":"EUR","nom":"euro","change":1}
 * @apiErrorExample {json} List error
 *    HTTP/1.1 500 Internal Server Error
 *    HTTP/1.1 404 Not Found Error
 */

apiRouter.route('/deviseApi/rest/public/devises/:code')
.get(asyncToResp(async function(req :Request, res :Response , next: NextFunction){
    let codeDevise = req.params.code;
    let devise = await deviseService.findById(codeDevise)
    return devise;
}));
/*.get( function(req :Request, res :Response , next: NextFunction ) {
     let codeDevise = req.params.numero;
     deviseService.findById(codeDevise)
       .then((devise)=> { res.send(devise) })
      .catch((err)=>{next(err);} ); 
});*/

//POST ... with body { "code": "M1" , "nom" : "monnaie1" , "change" : 1.123 }
apiRouter.route('/deviseApi/rest/public/devises').post( function(req :Request, res :Response , next: NextFunction ) {
    let  devise :Devise =  req.body ; //as javascript object
    //deviseService.insert(devise)
    deviseService.saveOrUpdate(devise)
    .then((savedDevise)=> { res.send(savedDevise)})
    .catch((err)=>next(err));
});

//PUT ... with body { "code": "USD" , "nom" : "dollar" , "change" : 1.1 }
apiRouter.route('/deviseApi/rest/public/devises').put( function(req :Request, res :Response , next: NextFunction ) {
    let  devise :Devise =  req.body ; //as javascript object
    deviseService.update(devise)
    .then((updatedDevise)=> { res.send(updatedDevise) })
    .catch((err)=>next(err));
});

// DELETE http://localhost:8282/deviseApi/rest/public/devises/EUR
apiRouter.route('/deviseApi/rest/public/devises/:code')
.delete( function(req :Request, res :Response , next: NextFunction ) {
    let codeDevise = req.params.code;
    deviseService.deleteById(codeDevise)
    .then(()=> { res.status(200).send({ "action" : "devise with code="+codeDevise + " was deleted"});})
    .catch((err)=>next(err));  
});


// http://localhost:8282/deviseApi/rest/public/devises renvoyant tout [ {} , {}]
// http://localhost:8282/deviseApi/rest/public/devises?changeMini=1.1 renvoyant [{}] selon critere
apiRouter.route('/deviseApi/rest/public/devises').get(function(req :Request, res :Response , next: NextFunction ) {
    let  changeMini = req.query.changeMini;
    deviseService.findAll()
    .then((deviseArray)=> { 
        if(changeMini){
            //filtrage selon critère changeMini:
            deviseArray = deviseArray.filter((dev)=>dev.tauxChange >= changeMini);
        }
        res.send(deviseArray) 
    })
    .catch((err)=>next(err));
});



apiRouter.route('/').get( function(req :Request, res :Response ) {
    res.setHeader('Content-Type', 'text/html');
    res.write("<html> <body>");
    res.write('<h3>index (developper page) of deviseApp</h3>');
    res.write('<a href="deviseApi/rest/public/devises/EUR">devise euro as Json string</a><br/>');
    res.write('<a href="deviseApi/rest/public/devises">toutes les devises (Json)</a><br/>');
    res.write('<a href="deviseApi/rest/public/devises?changeMini=1.1">devises avec change >= 1.1 (Json)</a><br/>');
    res.write('<a href="deviseApi/rest/public/devises/convertir?montant=50&source=EUR&cible=USD">convertir 50 euros en dollars</a><br/>');
    res.write('<p>utiliser POSTMAN ou autre pour tester en mode POST,PUT,DELETE</p>');
    res.write("</body></html>");
    res.end();
});

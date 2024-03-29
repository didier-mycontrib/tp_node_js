import express  from 'express'; 
import * as bodyParser from 'body-parser';
const fileUpload  = require('express-fileupload');
export const  app :express.Application = express();
import { apiErrorHandler} from './api/apiHandler'
import { globalRouter } from './api/globalRoutes';
import { deviseApiRouter } from './api/deviseApiRoutes';
import { publicationApiRouter } from './api/publicationApiRoutes';
import { loginApiRouter } from './api/loginApiRoutes';
import { verifTokenInHeadersForPrivatePath, secureModeApiRouter } from './api/verif-auth';
import { MyAppConfig } from './profiles/MyAppConfig';
import { myAppConnectionMap } from './db-connections/db-connections';


//PRE TRAITEMENTS (à placer en haut de server.ts)

//support parsing of JSON post data
var jsonParser = bodyParser.json() ;
app.use(jsonParser);

app.use(bodyParser.urlencoded({
    extended: true
  }));

//support for fileUpload:
app.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
  }));

//renvoyer directement les pages statiques rangées dans le répertoire "front-end":
app.use(express.static('front-end'));
/*
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH, DELETE"); //default: GET, ...
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
   if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE'); //to give access to all the methods provided
        return res.status(200).json({});
    }
  next();
});
*/

//verif auth beared token in request for private api/path:
app.use(verifTokenInHeadersForPrivatePath);

//ROUTES ORDINAIRES (apres PRE traitements , avant POST traitements)

app.use(globalRouter); //delegate some  global express routes
app.use(secureModeApiRouter); //dev-only ( http://localhost:8282/auth-api/dev-only/secure/true or false)
app.use(deviseApiRouter);  //delegate some REST API routes
app.use(publicationApiRouter);  //delegate some REST API routes
app.use(loginApiRouter);  //delegate some REST API routes  

//POST TRAITEMENTS (à placer en bas de server.ts):

app.use(apiErrorHandler); //pour gérer les erreurs/exceptions
                          //automatiquement rattrapées .then().catch() de asyncToResp (api/apiHandler.ts)
         /*exemple : deviseApiRouter.route('/devise/:code')
                        .get(asyncToResp(async function(req :Request, res :Response , next: NextFunction){
                            let codeDevise = req.params.code;
                            let devise = await deviseService.findById(codeDevise)
                            return devise; //apiErrorHandler via .catch(next); of asyncToResp
                        }));
*/

export const server = app.listen(process.env.PORT , function () {
    console.log("http://localhost:" + process.env.PORT );
    //console.log("process.argv="+ process.argv);
    if(MyAppConfig.isNoDB()){
      //...
    }else{
      //... 
    }   
    /*
    myAppConnectionMap.initConnections()
    .then((bOk)=>{ console.log("database connections is ok"); })                
    .catch((err)=>{console.log("database error:" + JSON.stringify(err)); } );
    */
    console.log("rest express node server listening at " + process.env.PORT);
});
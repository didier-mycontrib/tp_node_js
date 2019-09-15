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
import { MyAppConfig } from './config/MyAppConfig';


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
      console.log("starting with memoryMap services (no database)"); 
    }else{
      /*
      //if not called here , initConnections() will be deffered (lazy)
      myAppConnectionMap.initConnections()
                        .then((bOk)=>{ console.log("database connections is ok"); });               
      */   
    }                    
    console.log("rest express node server listening at " + process.env.PORT);
});
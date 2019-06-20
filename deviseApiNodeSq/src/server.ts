import express  from 'express';
import * as bodyParser from 'body-parser';
export const  app :express.Application = express();
import { apiErrorHandler} from './api/apiErrorHandler'
import { apiRouter } from './api/apiRoutes';
import { initSequelize } from './model/global-db-model'


//PRE TRAITEMENTS (à placer en haut de server.ts)

//support parsing of JSON post data
var jsonParser = bodyParser.json() ;
app.use(jsonParser);


//ROUTES ORDINAIRES (apres PRE traitements , avant POST traitements)

app.use(apiRouter); //delegate REST API routes to apiRouter
//app.use(apiRouter2); //delegate REST API routes to apiRouter2


//POST TRAITEMENTS (à placer en bas de server.ts):

app.use(apiErrorHandler); //pour gérer les erreurs/exceptions
                          //pas rattrapées par try/catch et qui se propagent
                          //alors automatiquement au niveau "express appelant mon code"


export const server = app.listen(8282 , function () {
    let mode = process.env.MODE; //env variable MODE=dev or MODE=prod when launching node
    if(mode == undefined) mode = "dev";
    console.log("mode="+mode);
    console.log("http://localhost:8282");
    initSequelize();
});
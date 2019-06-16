//import * as http from 'http';
//var bodyParser = require('body-parser');
import * as bodyParser from 'body-parser';
import express , { Request, Response } from 'express';
import exphbs  from 'express-handlebars';
import { publicApiRouter } from './api/publicApiRoutes';

const  app :express.Application = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//les routes en /html/... seront gérées par express
//par de simples renvois des fichiers statiques du répertoire "/html"
app.use('/html', express.static(__dirname+"/html"));

// support parsing of application/json type post data
app.use(bodyParser.json());

app.use(publicApiRouter); //delegate REST API routes to publicApiRouter
//app.use(privateApiRouter);

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req :Request, res : Response ) {
  res.redirect('/html/index.html');
});

app.get('/server-home', function(req :Request, res : Response ) {
     res.render('server-home');//rendering views/server-home.handlebars in the context of
                               //views/layouts/main.handlebars
});

app.get('/calcul', function(req :Request, res : Response ) {
    res.render('calcul'); //views/calcul.handlebars
});

//GET addition?a=5&b=6
app.get('/addition', function(req : Request, res : Response) {
  let va = Number(req.query.a);  //req.param("a") ok but deprecated
  let vb = Number(req.query.b);
  doAddgetOrPost(va,vb,res);
});

//POST addition with body containing a=5&b=6 (application/x-www-form-urlencoded)
app.post('/addition', function(req : Request, res : Response) {
  let va = Number(req.body.a); //app.use(bodyParser.urlencoded()); is required 
  let vb = Number(req.body.b); //req.body.a and .b construct by bodyParser
  doAddgetOrPost(va,vb,res);
});

function doAddgetOrPost(va:number,vb:number, res : Response){
 
	let vaPlusVb = va+vb;
  res.render('addResult', { a : va , 
                            b: vb , 
                            resAdd : vaPlusVb });
  //rendering views/addResult.handlebars with js values for
  //{{a}} , {{b}} , {{resAdd}}
}

app.listen(8282 , function () {
  console.log("http://localhost:8282");
});

export default {
 'app' : app
};




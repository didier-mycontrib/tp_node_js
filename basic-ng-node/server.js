var express = require('express'); //needs npm install -s express
var path= require('path');
var url= require('url');
var app = express();



var redirectDownloadToAngularIndexPage= 
  function(req , res , next ) {
    //send SPA index.html (or side *.js if base=".") 
    //instead of virtual relative angular routes "/ngr-*"
    let r = req.params.r; //ex: welcome
	var pathName= url.parse(req.url).pathname;
	//console.log("pathname="+pathName);//ex: /ng-bs4-app/ngr-welcome
	//console.log("ngr-"+r);//ex: /ng-bs4-app/ngr-welcome
	let posNgr = pathName.indexOf("/ngr-");
	let ngAppPrefix = pathName.substring(0,posNgr); //ex: /ng-bs4-app
    //console.log("ngAppPrefix="+ngAppPrefix);
    let relativeTo__dirname_prefix=""; // "" ou ".." selon structure projet
    let fileName ; 
    /* if(r.includes("."))
        fileName=r; //.js , .ico , .... (bundle or ... just aside index.html) , no necessary if base="/"
    else*/
       fileName=ngAppPrefix + "/index.html";//main angular page  
    //console.log("fileName="+fileName);	   
    res.sendFile(path.join(__dirname, 
       relativeTo__dirname_prefix  +'frontend-content' + fileName));
   }

//NB all angular routes should begin with "ngr-" 
//in src/app/app.routing.module.ts (in angular app)

app.get('*/ngr-:r', redirectDownloadToAngularIndexPage);


app.use( "/" , express.static(__dirname+"/frontend-content"));
//NB le repertoire frontend-content doit normalement
//comporter une copie de l'application angular 
//generée par ng build --prod (ex: my-app ou ng-bs4-app)
//avec dans index.html base href="." plutot que base href="/"


let port = process.env.PORT || 8989;
app.listen(port , function () {
  console.log("http://localhost:"+port);
});
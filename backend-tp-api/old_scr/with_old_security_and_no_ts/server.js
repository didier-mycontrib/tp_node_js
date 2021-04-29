//modules to load:
var express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
var bodyParser = require('body-parser');
var myGenericMongoClient = require("./my_generic_mongo_client");
var myGenericRestExpressUtil = require("./my_generic_rest_express_util");

var fs = require('fs'); 

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 },
}));

/*
// (TEMPORAIRE) CORS enabled with express/node-js :
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});
*/

app.use(express.static('front-end'));


//{  titre : "" , fichier_image : null ,  resume : "" , fichier_details_name : null , texte_complet : null , lien_externe : null , date : "2018-06-01"};
// POST : SAVE or UPDATE
app.post('/news-api/upload_publication', function(req, res,next) {
var publication = JSON.parse(req.body.publication); // explicit JSON.parse() needed here because multipart / formData / upload
//console.log("posting or reposting new publication :" +JSON.stringify(publication));

if (!req.files){
    //console.log('No files were uploaded.');
}
 else{
  // req.files.fileNameXyz (ici .imageFile et .detailsFile) 
  let imageFile = req.files.imageFile;
  if(imageFile){
	  // Use the mv() method to place the file somewhere on your server
	  imageFile.mv('./front-end/posts/images/' + imageFile.name, function(err) {
		if (err)
		  console.log(imageFile.name + " was not upload");
		else 
		  console.log(imageFile.name + " was upload in ./front-end/posts/images");
	  });
  }
  let detailsFile = req.files.detailsFile;
  if(detailsFile){
	  // Use the mv() method to place the file somewhere on your server
	  detailsFile.mv('./front-end/posts/' + detailsFile.name, function(err) {
		if (err)
		  console.log(detailsFile.name + " was not upload");
		else 
		  console.log(detailsFile.name + " was upload in ./front-end/posts/");
	  });
  }
 }
// POST : SAVE or UPDATE
if(publication){
  if(publication._id)/*UPDATE*/{
   var changes = JSON.parse(JSON.stringify(publication)); //clone of publication
   delete changes["_id"];	 
    //console.log ("changes:"+JSON.stringify(changes));
   myGenericMongoClient.genericUpdateOne("news",publication._id,changes,
	function(err,results){
					   console.log("update results:" + results);
					   myGenericRestExpressUtil.sendDataOrError(err,publication,res);// send back publication
				   });
  }
  else /* SAVE */
   myGenericMongoClient.genericInsertOne("news",publication,
	function(err,newId){
					   publication._id=newId;
					   myGenericRestExpressUtil.sendDataOrError(err,publication,res);// send back publication with _id
				   });
}				   
});

app.delete('/news-api/publication/:publicationId', function(req, res,next) {
var publicationId = req.params.publicationId; 
//console.log("deleting publication of _id=:" +publicationId);
myGenericMongoClient.genericDeleteOneById("news",publicationId ,
	    function(err,booleanResult){
			          if(booleanResult)
					      myGenericRestExpressUtil.sendStatusWithOrWithoutError(err,200,res);
					  else
						  myGenericRestExpressUtil.sendStatusWithOrWithoutError(err,500,res);//404 : NotFound or 500 : internal Error
				   });	
});


// .../news-api/publication
app.get('/news-api/publication', 
function(req, res , next) {
		myGenericMongoClient.genericFindList("news", { } , 
                   function(err,tabPublications){
					   myGenericRestExpressUtil.sendDataOrError(err,tabPublications,res);
				   });					   
});

app.get('/ngr/*', function(req, res , next) {
 //send SPA index.html instead of virtual relative angular routes "/ngr/*"
 res.sendFile(path.join(__dirname, 'front-end/index.html'));
});



app.get('/', function(req, res , next) {
res.setHeader('Content-Type', 'text/html');
res.write("<html> <header>");
res.write('<meta http-equiv="refresh" content="0;URL=front-end/index.html">');
res.write("</header> <body>");
res.write("</body></html>");
res.end();
});

app.get('/test-ws', function(req, res , next) {
res.setHeader('Content-Type', 'text/html');
res.write("<html> <header>");
res.write("</header> <body>");
res.write('<p>test-ws for server.js (REST WS via nodeJs/express/mongoDB)</p>');
res.write('<p><a href="news-api/publication"> liste des news publiees en JSON </a></p>');
res.write("</body></html>");
res.end();
});




app.listen(process.env.PORT , function () {
	//myGenericMongoClient.setMongoDbName('news');
	//myGenericMongoClient.setMongoDbUrl('mongodb://127.0.0.1:27017/news');
	myGenericMongoClient.setMongoDbName('test');
	myGenericMongoClient.setMongoDbUrl('mongodb://127.0.0.1:27017/test');
	myGenericMongoClient.executeInMongoDbConnection(
	function(currentDb){
		 console.log("connected to mongo database ");
	} );
    console.log("rest express node server listening at " + process.env.PORT);
});
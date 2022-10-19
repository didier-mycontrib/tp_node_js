import express from 'express';
var app = express();

//basic middleware for checking apiKey:
app.use(function(req, res, next) {
  let  apiKey = req.query.apiKey;
  if(apiKey == null){
     res.status(400).send({ err : "apiKey missing in request" , example :  "?apiKey=abc123"})
     //...
     //plus other code for checkin apiKey in database ...
  }else  next();
});


app.get("/api-xy/xx" , function(req,res,next){
   res.send([ { id: 1 , message : "xx1" } , { id: 2 , message : "xx2" } ]);
});

app.get("/api-xy/xx/:id" , function(req,res,next){
  let id = req.params.id; 
  if(id==null || id <=0 ) next({errorType : "BAD_REQUEST" , message: "id should be a valid positive integer and not 0"})
  if( id > 999) next({errorType : "NOT_FOUND" , message: "not xx found with id="+id})
  res.send( { id: id , message : "xx"+id } );
});

app.get("/api-xy/yy" , function(req,res,next){
  res.send([ { id: 1 , message : "yy1" } , { id: 2 , message : "yy2" } ]);
});


//basic error handler:
app.use(function(error, req, res, next) {
  let status = 500;
	let errorType = error?error.errorType:null ; 
	switch(errorType){
		case "BAD_REQUEST" : status = 400; break;
		case "NOT_FOUND" : status = 404; break;
		//...
		case "CONFLICT" : status = 409; break;
		default: status = 500;
	}
	res.status(status).send(error);
});

let backendPort = process.env.PORT || 8282; 
app.listen(backendPort , function () {
  console.log("http://localhost:"+backendPort);
});
/*
node server_middleware_error.mjs

//URL de test:

http://localhost:8282/api-xy/xx
http://localhost:8282/api-xy/xx?apiKey=azerty2
http://localhost:8282/api-xy/xx/12?apiKey=azerty2
http://localhost:8282/api-xy/xx/0?apiKey=azerty2
http://localhost:8282/api-xy/xx/1200?apiKey=azerty2

*/
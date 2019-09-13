function sendDataOrError(err,data,res){
if(err==null) {
	if(data!=null)
		res.send(data);
	else res.status(404).send(null);//not found
} else 
	res.status(500).send({error: err});//internal error 
}

function sendStatusWithOrWithoutError(err,statusCode,res){
if(err==null) 
    res.status(statusCode).send(null);//status Without Error
 else 
	 res.status(statusCode).send({error: err});//status With Error 
}


//var secureMode = false;
var secureMode = true;

function extractAndVerifToken(authorizationHeader){
if(secureMode==false) return true;
/*else*/
if(authorizationHeader!=null ){
if(authorizationHeader.startsWith("Bearer")){
var token = authorizationHeader.substring(7);
console.log("extracted token:" + token);
//code extremement simplifié ici:
//idealement à comparer avec token stocké en cache (si uuid token)
//ou bien tester validité avec token "jwt"
if(token != null && token.length>0)
return true ;
else
return false;
} else
return false;
} else
return false;
}

// verif bearer token in Authorization headers of request :
function verifTokenInHeaders(req, res, next) {
if( extractAndVerifToken(req.headers.authorization))
next();
else
res.status(401).send(null);//401=Unautorized or 403=Forbidden
}
// display Authorization in request (with bearer token):
function displayHeaders(req, res, next) {
//console.log(JSON.stringify(req.headers));
var authorization = req.headers.authorization;
console.log("Authorization: " + authorization);
next();
}

exports.displayHeaders = displayHeaders;
exports.verifTokenInHeaders = verifTokenInHeaders;
exports.sendDataOrError = sendDataOrError;
exports.sendStatusWithOrWithoutError = sendStatusWithOrWithoutError;

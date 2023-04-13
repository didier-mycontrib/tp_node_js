
//NEW UNIFIED VERSION (Standalone JWT or with OAuth2/oidc keycloak server)
import axios from 'axios';
import jwtUtil from './jwt-util.js';
import passport from 'passport';
import KeycloakBearerStrategy from 'passport-keycloak-bearer';
import express from 'express';
const apiRouter = express.Router();

var secureMode = false; //or true
var standaloneMode = true;  //or false if oauth2/oidc keycloak server is ready/accessible


// GLOBAL COMMON PART
//*************************************************** 

async function tryInitRemoteOAuth2OidcKeycloakMode(){
    try{
        await tryingOidcServerConnection("http://www.d-defrance.fr:8989/keycloak/realms/myrealm/.well-known/openid-configuration");
        initPassportKeycloakBearerStrategy();
        standaloneMode = false;
        console.log("initPassportKeycloakBearerStrategy ok , standaloneMode=false")
    }catch(ex){
        standaloneMode = true;
        console.log("initPassportKeycloakBearerStrategy not ok , standaloneMode=true")
    }
}
tryInitRemoteOAuth2OidcKeycloakMode();


//setting secureMode to true or false (tp , dev-only)
// GET http://localhost:8282/auth-api/public/dev-only/set-secure-mode/true or false renvoyant { secureMode : true_or_false}
apiRouter.route('/auth-api/public/dev-only/set-secure-mode/:mode')
.get(async function(req , res , next ) {
    let mode  = req.params.mode;
    secureMode = (mode=="true")? true : false;
    res.send( { secureMode : secureMode , standaloneMode : standaloneMode});
});

//getting current secureMode : true or false (tp , dev-only)
// GET http://localhost:8282/auth-api/public//dev-only/get-secure-mode renvoyant { secureMode : true_or_false}
apiRouter.route('/auth-api/public/dev-only/get-secure-mode')
.get(async function(req , res  , next ) {
    res.send({ secureMode : secureMode , standaloneMode : standaloneMode});
});

function verifTokenInHeadersForPrivatePath(req , res  , next ) {
    if( secureMode==false || !req.path.includes("/private/")){
       next();
    }
    else { //if secureMode==true
        if(standaloneMode)
            verifTokenInHeaders(req,res,next); //en une seule phase pour l'instant
        else
            checkAuthViaOauth2Oidc(req,res,next);//phase1 (401 if invalid token)
                                    //future phase 2 : ckeck_scope
    }
}


// OAuth2 / OIDC / KEYCLOACK PART
//*************************************************** 


async function tryingOidcServerConnection(wellKnownOpenidConfigUrl){
    try{
      const response  = await axios.get(wellKnownOpenidConfigUrl);                           
      console.log("wellKnownOpenidConfigUrl="+wellKnownOpenidConfigUrl+ " response.status : ", + response.status);
     }catch(ex){
         //console.log("exception ex as JSON string:" + JSON.stringify(ex));
         throw ex;
    }
  }

function extractOidcUserInfosFromJwtPayload(jwtPayload){
    return {
      username : jwtPayload.preferred_username,
      name : jwtPayload.name,
      email : jwtPayload.email,
      scope : jwtPayload.scope
    }
  }


function initPassportKeycloakBearerStrategy(){
/*
"url": "http://127.0.0.1:8989" ok
"url": "http://d2f2021:8989/keycloak" ok
"url": "https://d2f2021:8443/keycloak" don't work with self signed certificate
"url": "https://www.d-defrance.fr/keycloak" presque ok with real certificate in kong api-gateway
but "unable to verify the first certificate" (may be chain of certificate to configure???)
"url": "http://www.d-defrance.fr/keycloak" ok selon config
"url": "https://www.d-defrance.fr:8443/keycloak" pas ok
"url" : http://www.d-defrance.fr:8989/keycloak ok selon config
*/

// new KeycloakBearerStrategy(options, verify)
passport.use(new KeycloakBearerStrategy({
    "realm": "myrealm",
    "url": "http://www.d-defrance.fr:8989/keycloak"
  }, (jwtPayload, done) => {
    //console.log("jwtPayload="+ JSON.stringify(jwtPayload));
    const user = extractOidcUserInfosFromJwtPayload(jwtPayload);
    console.log("user="+ JSON.stringify(user));
    return done(null, user);
  }));

}


function checkAuthViaOauth2Oidc(req, res, next) {
    console.log(`secureMode=${secureMode} standaloneMode=${standaloneMode} checkAuthViaOauth2Oidc ...`)
    let authenticateFunction = passport.authenticate('keycloak'  , {session: false} );
    authenticateFunction(req,res,next);//send 401 if Unauthorized
    //or store user infos in req.user if auth is ok
  }

  function checkScopeForPrivatePath(req, res, next){
    if( secureMode==false || !req.path.includes("/private/") || standaloneMode)
       next();
    else {
        //console.log("req.method="+req.method)//"GET" or "POST" or ...
        if(req.method=="DELETE" && !req.user.scope.includes('resource.delete'))
            res.status(403).send({error:"Forbidden (valid jwt but no required resource.delete scope)"});
        else if((req.method=="POST" || req.method=="PUT" || req.method=="PATCH" ) && !req.user.scope.includes('resource.write'))
            res.status(403).send({error:"Forbidden (valid jwt but no required resource.write scope)"});
        else if((req.method=="GET") && !req.user.scope.includes('resource.read'))
            res.status(403).send({error:"Forbidden (valid jwt but no required resource.read scope)"});
        else next();//else if ok , continue
    }
  }

//******** Standalone JWT PART **********************
//*************************************************** 

// verif bearer token in Authorization headers of request :
function verifTokenInHeaders(req , res  , next ) {
    console.log(`secureMode=${secureMode} standaloneMode=${standaloneMode} verifTokenInHeaders ...`)
    jwtUtil.extractSubjectWithRolesClaimFromJwtInAuthorizationHeader(req.headers.authorization)
    .then((claim)=>{
        if(checkAuthorizedPathFromRolesInJwtClaim(req.path, claim))
            next(); //ok valid jwt and role(s) in claim sufficient for authorize path
        else
            res.status(403).send({ error:"Forbidden (valid jwt but no required role)"});
    })
    .catch((err)=>{res.status(401).send({ error: "Unauthorized "+err?err:"" });});//401=Unauthorized or 403=Forbidden
}

function checkAuthorizedPathFromRolesInJwtClaim(path,claim)/*:boolean*/{
    //console.log("path: " + path);
    //console.log("claim in jwt :" + JSON.stringify(claim));
    if(claim == null) return false;
    if(claim.roles == null || claim.roles=="") return true; //pas de verif vis à vis des rôles (simple jwt valide)
    /*
    //avec ancienne convention d'url avec role_xxx
    let arrayUserRoles = claim.roles.split(',');
    // authorize path including /private/role_xxx/ if xxx in arrayUserRoles
    let authorized = false;
    for(let role of arrayUserRoles){
        if(path.includes("/private/role_"+role+"/"))
            authorized=true;
    }*/
    let authorized = true;//avec nouvelle convention d'url sans role_xxx
    return authorized;
}


// GLOBAL COMMON DEFAULT EXPORT
//*************************************************** 
export  default { apiRouter , verifTokenInHeadersForPrivatePath , checkScopeForPrivatePath};




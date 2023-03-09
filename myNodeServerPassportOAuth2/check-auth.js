
import passport from 'passport';
import KeycloakBearerStrategy from 'passport-keycloak-bearer';

var secureMode = true; //or false

function verifTokenInHeadersForPrivatePath(req , res  , next ) {
    //console.log('checkAuth.verifTokenInHeadersForPrivatePath ...')
    if( secureMode==false || !req.path.includes("/private/"))
       next();
    else 
       checkAuth(req,res,next);//if secureMode==true
}

function extractUserInfosFromJwtPayload(jwtPayload){
    return {
      username : jwtPayload.preferred_username,
      name : jwtPayload.name,
      email : jwtPayload.email,
      scope : jwtPayload.scope
    }
  }

// new KeycloakBearerStrategy(options, verify)
passport.use(new KeycloakBearerStrategy({
    "realm": "myrealm",
    "url": "http://127.0.0.1:8989"
  }, (jwtPayload, done) => {
    //console.log("jwtPayload="+ JSON.stringify(jwtPayload));
    const user = extractUserInfosFromJwtPayload(jwtPayload);
    console.log("user="+ JSON.stringify(user));
    return done(null, user);
  }));
  
  
  function checkAuth(req, res, next) {
    //console.log('checkAuth ...')
    let authenticateFunction = passport.authenticate('keycloak'  , {session: false} );
    authenticateFunction(req,res,next);//send 401 if Unauthorized
    //or store user infos in req.user if auth is ok
  }

  function checkScopeForPrivatePath(req, res, next){
    if( secureMode==false || !req.path.includes("/private/"))
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

export  default { checkAuth , checkScopeForPrivatePath , verifTokenInHeadersForPrivatePath };




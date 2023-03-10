import axios from 'axios';


import passport from 'passport';
import KeycloakBearerStrategy from 'passport-keycloak-bearer';
import passportJwt from 'passport-jwt';
const ExtractJwt = passportJwt.ExtractJwt;
//NB: si autre provider de keycloak , soit trouver autre stategie existante , soit
//adapter le code source de passport-keycloak-bearer sur partie URL

async function mytokenIntrospection(options,accessToken) {
  try {
    console.log("accessToken="+accessToken);
    let formData = new URLSearchParams({
      token : accessToken ,
      client_id : options.client_id,
      client_secret : options.client_secret
    });
    const response = await axios.post(options.endpoint,formData, 
       { headers: {'Content-Type': 'application/x-www-form-urlencoded'}});
    const tokenDetails = response.data;
    console.log("tokenDetails="+JSON.stringify(tokenDetails));
    return tokenDetails;
  } catch (error) {
    throw new Error(
      `Unable to intropect token details from ${options.endpoint}: ${error.message}`
    );
  }

}




var secureMode = true; //or false


class MyDecryptBase64JWT {

  constructor (token) {

    this.token = token

    this.decrypt(token)

  }



  decrypt (token) {

    try {

      const [headerPart, contentPart, signaturePart] = token.split('.')

      this.header = JSON.parse(Buffer.from(headerPart, 'base64').toString())

      this.content = JSON.parse(Buffer.from(contentPart, 'base64').toString())

      this.signature = Buffer.from(signaturePart, 'base64')

      this.signed = `${headerPart}.${contentPart}`

    } catch (error) {

      throw new Error('Token is malformed')

    }

  }



  isExpired () {

    return !(this.content.exp * 1000 > Date.now())

  }

}




function verifTokenInHeadersForPrivatePath(req , res  , next ) {
    //console.log('checkAuth.verifTokenInHeadersForPrivatePath ...')
    if( secureMode==false || !req.path.includes("/private/"))
       next();
    else {
       checkAuth(req,res,next);//if secureMode==true
      /*
      // test (presque ok , pb 127.0.0.1 et localhost )
       let jwtFromRequest = (ExtractJwt.fromAuthHeaderAsBearerToken())(req);
       //console.log("jwtFromRequest="+jwtFromRequest+"\n");
       //let myDecryptBase64JWT = new MyDecryptBase64JWT(jwtFromRequest);
       //console.log("myDecryptBase64JWT="+JSON.stringify(myDecryptBase64JWT)+"\n");
       //NB: http://127.0.0.1 is ok but http://localhost is not ok for axios
       //NB: http://127.0.0.1 is not ok but http://localhost is  ok for token/introspect
       //==> ISSUE A TROUVER !!!! (ceci-dit , en prod autre config https, ...)
      mytokenIntrospection({
        endpoint: 'http://localhost:8989/realms/myrealm/protocol/openid-connect/token/introspect' ,
        client_id: 'client1',
        client_secret: '5sYgLuiSBpM3vP8jbabeOJR3Pw0gs7kF'
      },jwtFromRequest);

      //https://www.baeldung.com/postman-keycloak-endpoints ok avec postman !!!!
      */
    }
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





import jwtUtil from './jwt-util.js';

import express from 'express';
const apiRouter = express.Router();

var secureMode = false; //or true

//setting secureMode to true or false (tp , dev-only)
// GET http://localhost:8282/auth-api/public/dev-only/set-secure-mode/true or false renvoyant { secureMode : true_or_false}
apiRouter.route('/auth-api/public/dev-only/set-secure-mode/:mode')
.get(async function(req , res , next ) {
    let mode  = req.params.mode;
    secureMode = (mode=="true")? true : false;
    res.send( { secureMode : secureMode});
});

//getting current secureMode : true or false (tp , dev-only)
// GET http://localhost:8282/auth-api/public//dev-only/get-secure-mode renvoyant { secureMode : true_or_false}
apiRouter.route('/auth-api/public/dev-only/get-secure-mode')
.get(async function(req , res  , next ) {
    res.send({ secureMode : secureMode});
});

function verifTokenInHeadersForPrivatePath(req , res  , next ) {
    if( secureMode==false || !req.path.includes("/private/"))
       next();
    else 
       verifTokenInHeaders(req,res,next);//if secureMode==true
}

// verif bearer token in Authorization headers of request :
function verifTokenInHeaders(req , res  , next ) {
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

export  default { apiRouter , verifTokenInHeadersForPrivatePath };




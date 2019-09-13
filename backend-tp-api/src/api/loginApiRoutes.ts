import { Request, Response ,NextFunction, Router} from 'express';
import { Login } from '../model/login';
//import { ErrorWithStatus , NotFoundError, ConflictError } from '../error/errorWithStatus';
import { asyncToResp} from './apiHandler';
import { MemLoginService } from '../core/mem/MemLoginDataService';
import { LoginDataService } from '../core/itf/LoginDataService';
import { buildJwtToken } from '../util/jwt-util';

export const loginApiRouter = Router();

var  loginService : LoginDataService  = new MemLoginService();
                                      
//getting all login (tp , admin only)
// GET http://localhost:8282/login-api/private/role_admin/login renvoyant tout [ {} , {}]
loginApiRouter.route('/login-api/private/role_admin/login')
.get(asyncToResp(async function(req :Request, res :Response , next: NextFunction ) {
    //let  critereXy = req.query.critereXy;
    let loginArray = await loginService.findAll();
    return loginArray;
}));

//submitting authRequest (login) via post
//response = authResponse with token:
loginApiRouter.route('/login-api/public/auth')
.post(asyncToResp(async function(req :Request, res :Response , next: NextFunction ) {
    let  authReq :AuthRequest =  req.body ; //as javascript object via jsonParser
    let  authResponse : AuthResponse = {username : authReq.username ,
        status : null , message : null, 
        token : null , roles : null };
    let login= null;
    try{
        login = await loginService.findById(authReq.username);
    }catch(err){
        authResponse.message=err.message;
    }
	if(login==null){
		authResponse.message="login failed (wrong username)";
        authResponse.status=false;
	}
	else
     if(login.password == authReq.password){
        let arrayUserRoles = login.roles.split(',');
        let arrayAskedRoles = authReq.roles.split(',');
        let okRoles=true;
        for(let askedRole of arrayAskedRoles){
            if(!arrayUserRoles.includes(askedRole))
               okRoles=false;
        }
        if(okRoles==true){
            authResponse.message="successful login";
            authResponse.status=true;
            authResponse.roles=authReq.roles;
            authResponse.token=buildJwtToken(authReq.username,authReq.roles);
        } else{
            authResponse.message="login failed (good username/password but no asked roles="+authReq.roles+")";
            authResponse.status=false;
        }
    }else{
        authResponse.message="login failed (wrong password)";
        authResponse.status=false;
    }
    return authResponse;
}));

//posting new user account:
//POST ... with body { "username": "u1" , "password" : "pwdu1" , "roles" : "user" }
loginApiRouter.route('/login-api/private/role_admin/login')
.post(asyncToResp(async function(req :Request, res :Response , next: NextFunction ) {
    let  login :Login =  req.body ; //as javascript object via jsonParser
    let savedLogin = await loginService.insert(login);
    return savedLogin;
}));

//updating existing user account:
//PUT ... with body { "username": "u1" , "password" : "pwdU1" , "roles" : "user" }
loginApiRouter.route('/login-api/private/role_admin/login')
.put(asyncToResp(async  function(req :Request, res :Response , next: NextFunction ) {
    let  login :Login =  req.body ; //as javascript object
    let updatedLogin = await loginService.update(login);
    return updatedLogin;
}));

// DELETE http://localhost:8282/login-api/private/role_admin/login/user1
loginApiRouter.route('/login-api/private/role_admin/login/:username')
.delete(asyncToResp(async  function(req :Request, res :Response , next: NextFunction ) {
    let username = req.params.username;
    await loginService.deleteById(username)
    return{ "action" : "Login with username="+username + " was deleted"};
}));





import { LoginDataService } from "../itf/LoginDataService";
import { GenericNedbDataService } from "./generic/GenericNedbDataService";
import { Login , LoginObject  } from "../../model/login";
import { IdHelper, StaticIdHelper } from "../itf/generic/IdHelper";

// MongoDB implementation of LoginDataService 

export class NedbLoginService 
       extends GenericNedbDataService<Login,string>
       implements LoginDataService {


    constructor(){
        super("nedb-test" , "login" ,  new StaticIdHelper<Login,string>("username"));
        this.saveOrUpdate(new LoginObject("user1" , "pwduser1" , "user"));
        this.saveOrUpdate(new LoginObject("user2" , "pwduser2" , "user"));
        this.saveOrUpdate(new LoginObject("publisher1" , "pwdpublisher1" , "user,publisher"));
        this.saveOrUpdate( new LoginObject("publisher2" , "pwdpublisher2" , "publisher"));
        this.saveOrUpdate(new LoginObject("admin1" , "pwdadmin1" , "admin,user"));
        this.saveOrUpdate(new LoginObject("admin2" , "pwdadmin2" , "admin"));
    }

}
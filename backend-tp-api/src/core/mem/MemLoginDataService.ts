import { LoginDataService } from "../itf/LoginDataService";
import { GenericMemDataService } from "./generic/GenericMemDataService";
import { Login , LoginObject } from "../../model/login";
import { IdHelper, StaticIdHelper } from "../itf/generic/IdHelper";

// memory Map implementation of LoginDataService 

export class MemLoginService 
       extends GenericMemDataService<Login,string>
       implements LoginDataService {

    private loginIdHelper : IdHelper<Login,string> = new StaticIdHelper<Login,string>("username");

    constructor(){
        super();
        this.idHelper=this.loginIdHelper;
        this.dataMap.set("user1", new LoginObject("user1" , "pwduser1" , "user"));
        this.dataMap.set("user2", new LoginObject("user2" , "pwduser2" , "user"));
        this.dataMap.set("publisher1", new LoginObject("publisher1" , "pwdpublisher1" , "user,publisher"));
        this.dataMap.set("publisher2", new LoginObject("publisher2" , "pwdpublisher2" , "publisher"));
        this.dataMap.set("admin1", new LoginObject("admin1" , "pwdadmin1" , "admin,user"));
        this.dataMap.set("admin2", new LoginObject("admin2" , "pwdadmin2" , "admin"));
    }

    

}
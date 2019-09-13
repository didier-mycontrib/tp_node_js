export interface Login  {
   username :string ; //id/pk (may be userId or unique email)
   password :string ; //may be stored as crypted password
   roles :string ; //ex: null or "admin,user" or "user" or ...
}

//export type LoginItf = Login ; /* simple type alias */


//real class for instanciation ,  with constructor .
export class LoginObject implements Login {
   constructor(public username:string = null , 
               public password:string = null,
               public roles:string= null){
   }
}

//GENERIC PART (SEQUELIZE OR NOT)
export interface User  {
   id :number | undefined ; 
   firstName :string ;
   lastName : string ;
   phoneNumber? : string ;
   email? : string ;
}


//real class for instanciation ,  with constructor .
export class UserObject implements User {
   constructor(public id:number |undefined , 
               public firstName:string = "?",
               public lastName:string = "?",
               public phoneNumber:string = "?",
               public email:string = "?"){
   }
}

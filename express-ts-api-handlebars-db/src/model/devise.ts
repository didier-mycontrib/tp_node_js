//interface name "....Attributes" is traditional within Sequelize
export interface DeviseAttributes  {
   code :string ; 
   name :string ;
   change :number ;
}
//export type Devise = DeviseAttributes | DeviseObject;
export type Devise = DeviseAttributes ; /* simple type alias */
// Devise in a natural/simple type name for every technology

//real class for instanciation ,  with constructor .
export class DeviseObject implements DeviseAttributes {
   constructor(public code:string = "?" , 
               public name:string = "?",
               public change:number= 0){
   }
}



//exemples: ("USD" , "dollar" , 1) ,  ("EUR" , "euro" , 0.9)
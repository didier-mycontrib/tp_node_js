//GENERIC PART (SEQUELIZE OR NOT)
export interface Devise  {
   code :string ; 
   monnaie :string ;
   tauxChange :number ;
}

//exemples: ("USD" , "dollar" , 1) ,  ("EUR" , "euro" , 0.9)

//real class for instanciation ,  with constructor .
export class DeviseObject implements Devise {
   constructor(public code:string = "?" , 
               public monnaie:string = "?",
               public tauxChange:number= 0){
   }
}

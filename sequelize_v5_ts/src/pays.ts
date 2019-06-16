//GENERIC PART (SEQUELIZE OR NOT)
export interface Pays  {
   //code :string ; 
   idPays : number
   name :string ;
   capitale :string ;
}

//exemple: (1 , "France" , "Paris") 

//real class for instanciation ,  with constructor .
export class PaysObject implements Pays {
   constructor(public idPays:number = 0 , 
               public name:string = "?",
               public capitale:string="?"){
   }
}

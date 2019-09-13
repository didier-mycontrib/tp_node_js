export interface Publication  {
   _id :string ; 
   titre :string ;
   fichier_image_name :string ;
   resume :string;
   texte_complet :string;
   date: string;//"2019-09-20"
   fichier_details_name :string;
   lien_externe :string;
}

//export type PublicationItf = Publication; /* simple type alias */


//real class for instanciation ,  with constructor .
export class PublicationObject implements Publication {
   constructor(public  _id :string = null , 
               public titre:string = "titre ?",
               public fichier_image_name:string= null,
			   public resume:string= null,
			   public texte_complet:string= null,
			   public date:string= null,
			   public fichier_details_name:string= null,
			   public lien_externe:string= null){
   }
}

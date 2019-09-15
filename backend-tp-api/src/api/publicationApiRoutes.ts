import { Request, Response ,NextFunction, Router} from 'express';
import * as  fileUpload  from 'express-fileupload';
type UploadedFile = fileUpload.UploadedFile;
import { PublicationDataService } from '../core/itf/PublicationDataService';
import { MongoPublicationService } from '../core/mongo/MongoPublicationDataService';
import { asyncToResp } from './apiHandler';
import { MyAppConfig } from '../config/MyAppConfig';
import { MemPublicationService} from "../core/mem/MemPublicationDataService";

var  publicationService : PublicationDataService  = initPublicationService();
function initPublicationService() : PublicationDataService {
  if(MyAppConfig.isNoDB())
       return new MemPublicationService();
  else
       return new MongoPublicationService();
}

export const publicationApiRouter = Router();

// http://localhost:8282/news-api/public/publication renvoyant tout [ {} , {}]
// http://localhost:8282/news-api/public/publication?... renvoyant [{}] selon critere
publicationApiRouter.route('/news-api/public/publication')
.get(asyncToResp(async function(req :Request, res :Response , next: NextFunction ) {
    //let  critereXy = req.query.critereXy;
    let pubArray = await publicationService.findAll();
    return pubArray;
}));

// DELETE http://localhost:8282/news-api/private/role_publisher/publication/xyz
publicationApiRouter.route('/news-api/private/role_publisher/publication/:idPub')
.delete(asyncToResp(async  function(req :Request, res :Response , next: NextFunction ) {
    let idPub = req.params.idPub;
    await publicationService.deleteById(idPub)
    return{ "action" : "publication with idPub="+idPub + " was deleted"};
}));



//{  titre : "" , fichier_image : null ,  resume : "" , fichier_details_name : null , texte_complet : null , lien_externe : null , date : "2018-06-01"};
// POST : SAVE or UPDATE
publicationApiRouter.route('/news-api/private/role_publisher/upload_publication')
.post(asyncToResp(async  function(req :Request, res :Response , next: NextFunction ) {    
    var publication = JSON.parse(req.body.publication); // explicit JSON.parse() needed here because multipart / formData / upload
    //console.log("posting or reposting new publication :" +JSON.stringify(publication));
    
    if (!req.files){
        //console.log('No files were uploaded.');
    }
     else{
      // req.files.fileNameXyz (ici .imageFile et .detailsFile) 
      let imageFile = req.files.imageFile as any as UploadedFile;
      if(imageFile){
          // Use the mv() method to place the file somewhere on your server
          imageFile.mv('./front-end/posts/images/' + imageFile.name, function(err) {
            if (err)
              console.log(imageFile.name + " was not upload");
            else 
              console.log(imageFile.name + " was upload in ./front-end/posts/images");
          });
      }
      let detailsFile = req.files.detailsFile as any as UploadedFile;
      if(detailsFile){
          // Use the mv() method to place the file somewhere on your server
          detailsFile.mv('./front-end/posts/' + detailsFile.name, function(err) {
            if (err)
              console.log(detailsFile.name + " was not upload");
            else 
              console.log(detailsFile.name + " was upload in ./front-end/posts/");
          });
      }
     }
    
    if(publication){// POST : SAVE or UPDATE
      let savedPublication = await publicationService.saveOrUpdate(publication);
       return savedPublication;
    }				   
    }));

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoosePublicationService = void 0;
const GenericMongooseDataService_1 = require("./generic/GenericMongooseDataService");
const publication_1 = require("../../model/publication");
// MongoDB implementation of PublicationDataService 
class MongoosePublicationService extends GenericMongooseDataService_1.GenericMongooseDataService {
    //défini dans model/mongoose/m-publication.ts 
    //plus précis que mongooseModel (de la super classe)
    //et à utiliser pour coder les méthodes
    //de recherches spécifiques (non génériques)        
    constructor() {
        super("mongoose-test", "publication" /* ,  new Auto_IdHelper<Publication,string>("_id") by default */);
        this.initModel()
            .then((model) => {
            this.persistentPublicationModel = model;
            this.initDataSet();
        })
            .catch((error) => { console.log("erreur initialisation MongoosePublicationService"); });
    }
    initDataSet() {
        this.saveOrUpdate(new publication_1.PublicationObject("1", "gros horloge rouen(mg)", "rouen.jpg", "rue du gros Horloge", null, "2019-07-12", null, "https://fr.wikipedia.org/wiki/Gros-Horloge"));
        this.saveOrUpdate(new publication_1.PublicationObject("2", "chateau de gaillon(mg)", "gaillon.jpg", "chateau gaillon (renaissance)", null, "2019-07-11", null, "https://www.tourisme-seine-eure.com/decouvrir/top-10-pour-visiter/le-chateau-de-gaillon/"));
        this.saveOrUpdate(new publication_1.PublicationObject("3", "tour eiffel(mg)", "tourEiffel.jpg", "tour eiffel (Paris)", "<p> la <b>Tour Eiffel</b> mesure environ 300 mètres </p>", "2019-07-12", null, null));
        this.saveOrUpdate(new publication_1.PublicationObject("4", "Mont Saint Michel(mg)", "montSaintMichel.jpg", "Mont Saint Michel", "<p> le <b>Mont Saint Michel</b> change de couleur très fréquemment </p>", "2019-07-11", null, null));
    }
}
exports.MongoosePublicationService = MongoosePublicationService;

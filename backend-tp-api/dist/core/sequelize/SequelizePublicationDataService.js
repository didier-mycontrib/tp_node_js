"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequelizePublicationService = void 0;
const GenericSequelizeDataService_1 = require("./generic/GenericSequelizeDataService");
const publication_1 = require("../../model/publication");
const IdHelper_1 = require("../itf/generic/IdHelper");
// NeDB implementation of PublicationDataService 
class SequelizePublicationService extends GenericSequelizeDataService_1.GenericSequelizeDataService {
    //défini dans model/sequelize/sq-publication.ts 
    //plus précis que sequelizeModel (de la super classe)
    //et à utiliser pour coder les méthodes
    //de recherches spécifiques (non génériques)            
    constructor() {
        super("sq-test", "publication", new IdHelper_1.Auto_IdHelper("_id"));
        this.initModel()
            .then((model) => {
            this.persistentPublicationModel = model;
            this.initDataSet();
        })
            .catch((error) => { console.log("erreur initialisation SequelizePublicationService"); });
    }
    initDataSet() {
        this.saveOrUpdate(new publication_1.PublicationObject("1", "gros horloge rouen(sq)", "rouen.jpg", "rue du gros Horloge", null, "2019-07-12", null, "https://fr.wikipedia.org/wiki/Gros-Horloge"));
        this.saveOrUpdate(new publication_1.PublicationObject("2", "chateau de gaillon(sq)", "gaillon.jpg", "chateau gaillon (renaissance)", null, "2019-07-11", null, "https://www.tourisme-seine-eure.com/decouvrir/top-10-pour-visiter/le-chateau-de-gaillon/"));
        this.saveOrUpdate(new publication_1.PublicationObject("3", "tour eiffel(sq)", "tourEiffel.jpg", "tour eiffel (Paris)", "<p> la <b>Tour Eiffel</b> mesure environ 300 mètres </p>", "2019-07-12", null, null));
        this.saveOrUpdate(new publication_1.PublicationObject("4", "Mont Saint Michel(sq)", "montSaintMichel.jpg", "Mont Saint Michel", "<p> le <b>Mont Saint Michel</b> change de couleur très fréquemment </p>", "2019-07-11", null, null));
    }
}
exports.SequelizePublicationService = SequelizePublicationService;

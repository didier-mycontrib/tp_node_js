"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlitePublicationService = void 0;
const GenericSqliteDataService_1 = require("./generic/GenericSqliteDataService");
const publication_1 = require("../../model/publication");
const IdHelper_1 = require("../itf/generic/IdHelper");
// NeDB implementation of PublicationDataService 
class SqlitePublicationService extends GenericSqliteDataService_1.GenericSqliteDataService {
    constructor() {
        super("sqlite-test", "publication", new IdHelper_1.Auto_IdHelper("_id", "1"));
        this.initPublicationTableInDb(() => {
            this.saveOrUpdate(new publication_1.PublicationObject("1", "gros horloge rouen(mem)", "rouen.jpg", "rue du gros Horloge", null, "2019-07-12", null, "https://fr.wikipedia.org/wiki/Gros-Horloge"));
            this.saveOrUpdate(new publication_1.PublicationObject("2", "chateau de gaillon(mem)", "gaillon.jpg", "chateau gaillon (renaissance)", null, "2019-07-11", null, "https://www.tourisme-seine-eure.com/decouvrir/top-10-pour-visiter/le-chateau-de-gaillon/"));
            this.saveOrUpdate(new publication_1.PublicationObject("3", "tour eiffel(mem)", "tourEiffel.jpg", "tour eiffel (Paris)", "<p> la <b>Tour Eiffel</b> mesure environ 300 mètres </p>", "2019-07-12", null, null));
            this.saveOrUpdate(new publication_1.PublicationObject("4", "Mont Saint Michel(mem)", "montSaintMichel.jpg", "Mont Saint Michel", "<p> le <b>Mont Saint Michel</b> change de couleur très fréquemment </p>", "2019-07-11", null, null));
        });
    }
    initPublicationTableInDb(postInitCallback) {
        this.dB().then((db) => {
            db.serialize(function () {
                // id INTEGER PRIMARY KEY used here (autoincr as an alias as rowid)
                db.run(`CREATE TABLE if not exists publication 
                       (_id INTEGER PRIMARY KEY, 
                       titre VARCHAR(64) NOT NULL , 
                       fichier_image_name VARCHAR(128) , 
                       resume VARCHAR(128) , 
                       texte_complet VARCHAR(256) ,
                       date VARCHAR(64) ,
                       fichier_details_name VARCHAR(128) ,
                       lien_externe VARCHAR(128))`);
                postInitCallback();
            }); //end of db.serialize
        }); //end of this.dB().then ( (db)=> {
    }
}
exports.SqlitePublicationService = SqlitePublicationService;

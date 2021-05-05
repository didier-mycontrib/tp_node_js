import { DeviseDataService } from "../itf/DeviseDataService";
import { GenericSqliteDataService } from "./generic/GenericSqliteDataService";
import { Devise , DeviseObject  } from "../../model/devise";
import { IdHelper, StaticIdHelper } from "../itf/generic/IdHelper";
import * as sqlite from 'sqlite3';
const sqlite3 = sqlite.verbose();
// Sqlite implementation of DeviseDataService 

export class SqliteDeviseService 
       extends GenericSqliteDataService<Devise,string>
       implements DeviseDataService {


    constructor(){
        super("sqlite-test" , "devise" ,  new StaticIdHelper<Devise,string>("code"));
        this.initDeviseTableInDb(
          ()=>{
            this.saveOrUpdate(new DeviseObject("USD" , "Dollar" , 1));
            this.saveOrUpdate( new DeviseObject("EUR" , "Euro" , 0.91));
            this.saveOrUpdate( new DeviseObject("GBP" , "Livre" , 0.81));
            this.saveOrUpdate( new DeviseObject("JPY" , "Yen" , 132.01));
          }
        );
    }

    
    initDeviseTableInDb(postInitCallback: ()=>void){
        this.dB().then ( (db)=> {
          db.serialize(function() {
      
            // Devise_ID INTEGER PRIMARY KEY  not used here (no autoincr)
      
            db.run(`CREATE TABLE if not exists devise 
                       (code VARCHAR(12) PRIMARY KEY, 
                       name VARCHAR(64) NOT NULL , 
                       change DOUBLE)`);
            
            postInitCallback();
          });//end of db.serialize
        });//end of this.dB().then ( (db)=> {
      }

      findByChangeMini(changeMini: number): Promise<Devise[]> {
        throw new Error('Method not implemented.');
    }

}
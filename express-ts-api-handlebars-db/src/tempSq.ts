import { SqDeviseService } from './dao/sequelize/SqDeviseService';
import { sequelize } from './model/sequelize/global-db-model';

sequelize.sync({logging: console.log})
			  .then(
				()=>{ 
				      doJobWithSequelize();
                      }
			  ).catch( (err:any) => { console.log('An error occurred :', err);  });
			  
function doJobWithSequelize(){
let sqDeviseService = new SqDeviseService();

sqDeviseService.findById("EUR")
  .then( (dev)=>{ console.log("devise EUR found:" +JSON.stringify(dev)); })
  .catch( (e) => { console.log("error:"+JSON.stringify(e)); })
  
/*
 sqDeviseService.addDevise({code:'EUR',name:'Euro',change:0.9})
 .then( (dev)=>{ console.log("added:" + JSON.stringify(dev)); })
 .catch( (e) => { console.log("error:"+JSON.stringify(e)); })
*/
}
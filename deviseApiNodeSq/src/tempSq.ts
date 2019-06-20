import { SqDeviseService } from './dao/SqDeviseService';
import { sequelize } from './model/global-db-model';
import { Devise } from './model/devise';

sequelize.sync({logging: console.log})
			  .then(
				()=>{ 
							doCrudJobOnDeviseWithSequelize(); //with pk=code (string) no auto_incr
                      }
			  ).catch( (err:any) => { console.log('An error occurred :', err);  });
			  
async function  doCrudJobOnDeviseWithSequelize(){
let sqDeviseService = new SqDeviseService();

try{

	const deviseEur : Devise =  await sqDeviseService.insert({code:'EUR',monnaie:'euro',tauxChange:0.92});
	console.log("after insert : deviseEur="+JSON.stringify(deviseEur));
	
	const deviseEurRelue : Devise =  await sqDeviseService.findById("EUR");
	console.log("after findById : deviseEur="+JSON.stringify(deviseEurRelue));
/*
	  //Création (ou mise à jour si exite déjà ) de la devise "EUR":
		const deviseEur : Devise =  await sqDeviseService.saveOrUpdate({code:'EUR',name:'Euro',change:0.92});
		console.log("after saveOrUpdate : deviseEur="+JSON.stringify(deviseEur));

		//Création/insert nouvelle DeviseSinge:
		const deviseSinge : Devise =  await sqDeviseService.insert({code:'SIN',name:'MonnaieSinge',change:12345.6789});
		console.log("after insert : deviseSinge="+JSON.stringify(deviseSinge));

	  //Modif , Maj en base de monnaieSinge:
		deviseSinge.change=99.99;
		deviseSinge.name="MonnaieSinge2";
		const deviseSingeModifiee : Devise =  await sqDeviseService.update(deviseSinge);

		//relecture depuis base pour verif:
		const deviseSingeRelue : Devise =  await sqDeviseService.findById("SIN");
		console.log("after update & findById : deviseSinge="+JSON.stringify(deviseSingeRelue));

		//recherche multiple:
		const listeDevises : Devise[] =  await sqDeviseService.findAll();
		console.log("findAll : listeDevises="+JSON.stringify(listeDevises));

		//suppression devise "SIN" (MonnaieSinge):
		await sqDeviseService.deleteById("SIN");

		try{
		//tentative de relecture pour verifier suppression:
		const deviseSingeNormalementSupprimee : Devise =  await sqDeviseService.findById("SIN");
		console.log("deviseSingeNormalementSupprimee:" + JSON.stringify(deviseSingeNormalementSupprimee));
		}catch(ee){
			console.log("exception normale apres suppression:" + JSON.stringify(ee));
		}
	*/
	} catch(e){
		console.log(JSON.stringify(e));
	}
}

import { SqDeviseService } from './SqDeviseService';
import { sequelize , models } from './global-db-model';
import { Devise } from './devise';
import { SqUserService } from './SqUserService';
import { User } from './user';
import { SqDevise } from './sq-devise';
import { Pays, PaysObject } from './pays';

sequelize.sync({logging: console.log})
			  .then(
				()=>{      doAssociationJob();
							//doCrudJobOnDeviseWithSequelize(); //with pk=code (string) no auto_incr
							//doCrudJobOnUserWithSequelize();//with pk=id (number) auto_incr
                      }
			  ).catch( (err:any) => { console.log('An error occurred :', err);  });

async function  doAssociationJob(){
				
			try{
                let devC1 : SqDevise = await models.devises.findByPk("CC1", { include :[models.devises.associations.pays]});
                if(devC1==null){
				 devC1= await models.devises.create({code: 'CC1',name: 'MonaieC1',change : 1234 });
				  let pays1forDevC1 :Pays = await models.pays.create({name:"Pays1",capitale:"Cap1"});
				  await devC1.addPays(pays1forDevC1);
				  console.log(JSON.stringify(pays1forDevC1));
				  let pays2forDevC1 :Pays = await models.pays.create({name:"Pays2",capitale:"Cap2"});
				  await devC1.addPays(pays2forDevC1);
				  console.log(JSON.stringify(pays2forDevC1));
				}
				  console.log(devC1.code, devC1.name, devC1.change);

			   let devC2 : SqDevise = await models.devises.findByPk("CC2" , { include :[models.devises.associations.pays]});
                if(devC2==null){
				 devC2= await models.devises.create({code: 'CC2',name: 'MonaieC2',change : 1.111 });
				  let paysAforDevC2 :Pays = await models.pays.create({name:"PaysA",capitale:"CapA"});
				  await devC2.addPays(paysAforDevC2);
				  console.log(JSON.stringify(paysAforDevC2));
				  let paysBforDevC2 :Pays = await models.pays.create({name:"PaysB",capitale:"CapB"});
				  await devC2.addPays(paysBforDevC2);
				  console.log(JSON.stringify(paysBforDevC2));
				}
				  //console.log(devC2.code, devC2.name, devC2.change);
				  console.log(JSON.stringify(devC2));
				
				
				}
			catch(e){
				console.log(JSON.stringify(e));
			}
}			  

			  
async function  doCrudJobOnDeviseWithSequelize(){
let sqDeviseService = new SqDeviseService();

try{

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
	
	} catch(e){
		console.log(JSON.stringify(e));
	}
}

async function  doCrudJobOnUserWithSequelize(){
	let sqUserService = new SqUserService();
	
	try{
	
			//Création (ou mise à jour si exite déjà ) de l'utilisateur de id=1:
			const user1 : User =  await sqUserService.saveOrUpdate({id:1,firstName:'jean',lastName:'Bon',
			                                            phoneNumber:'0102040405',email:"jean.bon@xyz.fr"});
			console.log("after saveOrUpdate : user1="+JSON.stringify(user1));
	
			//Création/insert nouvel utilisateur:
			const userXyz : User =  await sqUserService.insert({id:null,firstName:'alex',lastName:'Therieur',
			phoneNumber:'0101010101',email:"alex.Therieur@xyz.fr"});
			console.log("after insert : userXyz="+JSON.stringify(userXyz));
			let idOfNewUser = userXyz.id;
	
			//Modif , Maj en base de l'utilisateur:
			userXyz.firstName="alain";
			userXyz.phoneNumber='0202020202'
			userXyz.email="alain.Therieur@xyz.fr";
			const userXyzModifie : User =  await sqUserService.update(userXyz);
	
			//relecture depuis base pour verif:
			const userXyzRelu : User =  await sqUserService.findById(idOfNewUser);
			console.log("after update & findById : userXyzRelu="+JSON.stringify(userXyzRelu));
	
			//recherche multiple:
			const listeUsers : User[] =  await sqUserService.findAll();
			console.log("findAll : listeUsers="+JSON.stringify(listeUsers));
	
			//suppression user de id=idOfNewUser:
			await sqUserService.deleteById(idOfNewUser);
	
			try{
			//tentative de relecture pour verifier suppression:
			const userXyzNormalementSupprime : User =  await sqUserService.findById(idOfNewUser);
			console.log("userXyzNormalementSupprime:" + JSON.stringify(userXyzNormalementSupprime));
			}catch(ee){
				console.log("exception normale apres suppression:" + JSON.stringify(ee));
			}
		
		} catch(e){
			console.log(JSON.stringify(e));
		}
	}
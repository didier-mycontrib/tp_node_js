var MyModel = require('./db-model.js');

//MyModel.sequelize.sync()
MyModel.sequelize.sync({logging: console.log})
			  .then(
				()=>{ //doJob1WithSequelize_version_simpliste()
				      //doJob1WithSequelize();
                      doJob1WithSequelizeAndAsyncAwait();					  
				      doJob2WithSequelize();}
			  ).catch( (err) => { console.log('An error occurred :', err);  });
			  
function doJob0WithSequelize(){
console.log("...");

MyModel.AddressOfCustomer.create({numberAndStreet: '123 rue xyz', zip : '76000',    town: 'Rouen'  }).then(
     (a) => { console.log(JSON.stringify(a));
              console.log("AddressOfCustomer auto-generated ID:", a.idAddr);	 }
  );
MyModel.AddressOfCustomer.create({numberAndStreet: '456 rue abc', zip : '76000',    town: 'Rouen'  }).then(
     (a) => { console.log(JSON.stringify(a)); }
  ); 
MyModel.AddressOfCustomer.create({numberAndStreet: '456 rue abc', zip : '80000',    town: 'Amiens'  }).then(
     (a) => { console.log(JSON.stringify(a)); }
  );  


const findCriterias = {
        where: {town : 'Rouen'}, //on veux uniquement ceux qui ont la ville = "Rouen"
        order: [['town', 'ASC']] //classer par ordre alphabétique sur le ville
    };

//MyModel.AddressOfCustomer.findAll().then(adrs => {
MyModel.AddressOfCustomer.findAll(findCriterias).then(adrs => {	
        //on récupère ici un tableau "adrs" contenant une liste d'addresses
        console.log("*** AddressOfCustomers avec Rouen =" + JSON.stringify(adrs));
    }).catch(function (e) {
        console.log(e);
    });

const mySpecificRawSqlRequest = "SELECT town as ville , zip as codePostal FROM address_of_customer WHERE id_addr = $1";
const param_id_addr=1; 
MyModel.sequelize.query(mySpecificRawSqlRequest, {bind: [param_id_addr], type: MyModel.sequelize.QueryTypes.SELECT}).then(results => {
        console.log(">>>> Specific Request results="+JSON.stringify(results));
    }).catch(function (e) {
        console.log(e);
    });	

 //exemple de requête d'update d'une AddressOfCustomer
MyModel.AddressOfCustomer.update(
            {numberAndStreet: 'Rue_rue_rue_rue'},
            {where: {idAddr: 1}}
    ).then(nbAddressOfCustomersModifiees => {
        console.log("nbAddressOfCustomersModifiees:" + nbAddressOfCustomersModifiees);
    }).catch(function (e) {
        console.log(e);
    });

MyModel.AddressOfCustomer.findByPk(1).then(adr => {		
//MyModel.AddressOfCustomer.findOne( { where : { idAddr : 1} } ).then(adr => {	
        //on récupère ici l'unique AddressOfCustomer recherchée par sont id (primary key)
        console.log("** Addresse avec idAdr=1 : " + JSON.stringify(adr));
    }).catch(function (e) {
        console.log(e);
    });		
	
MyModel.AddressOfCustomer.destroy({  where: { idAddr: 3 }}).then(() => {
  console.log("Addresse avec id=3 supprimée");
}).catch(function (e) {
     console.log(e);
 });		
}

//**********************************************
//********Customer : id, firtName , lastName , phoneNumber , email 

function doJob1WithSequelize_version_simpliste(){
console.log("... doJob1WithSequelize ... Customer ...");
//TESTS ELEMENTAIRES NON SYNCHRONISES (exemples simples sans enchainement)
//a commenter/decommenter par blocs cohérents
/*
MyModel.Customer.create({id:null, firstName: 'Jean', lastName: 'Bon', phoneNumber : '0605040302',    email: 'jean.bon@charcuterie.fr'  })
.then((c) => { console.log("saved Customer," + JSON.stringify(c));
              console.log("Customer auto-generated ID:", c.id);	 }
  );
MyModel.Customer.create({id:null, firstName: 'Alex', lastName: 'Therieur', phoneNumber : '0605040301',    email: 'alex.therieur@charcuterie.fr'  })
.then((c) => { console.log("saved Customer," + JSON.stringify(c)); } ); 
 
MyModel.Customer.create({id:null, firstName: 'Alain', lastName: 'Therieur', phoneNumber : '0608040301',    email: 'alex.therieur@charcuterie.fr'  })
.then((c) => { console.log("saved Customer," + JSON.stringify(c)); } ); 
*/
/*

const findCriterias = {
        where: {lastName : 'Therieur'}, //on veux uniquement ceux qui ont lastName = 'Therieur'
        order: [['lastName', 'ASC']] //classer par ordre alphabétique sur le lastName
    };

//MyModel.Customer.findAll().then(adrs => {
MyModel.Customer.findAll(findCriterias).then(customers => {	
        //on récupère ici un tableau "customers" contenant une liste de customers
        console.log("*** Customers de nom=Therieur :" + JSON.stringify(customers));
    }).catch(function (e) {
        console.log(e);
    });

const mySpecificRawSqlRequest = "SELECT firstName as prenom , lastName as nom , phoneNumber as telephone FROM customer WHERE id = $1";
const param_id_customer=1; 
MyModel.sequelize.query(mySpecificRawSqlRequest, 
                       {bind: [param_id_customer], 
					   type: MyModel.sequelize.QueryTypes.SELECT})
	.then(results => {
        console.log(">>>> Specific Request results="+JSON.stringify(results));
    }).catch(function (e) {
        console.log(e);
    });	
*/
/*
 //exemple de requête d'update d'un Customer
MyModel.Customer.update(
            {phoneNumber: '0606060606'},
            {where: {id: 1}}
    ).then(nbCustomersModifies => {
        console.log("nbCustomersModifies:" + nbCustomersModifies);
    }).catch(function (e) {
        console.log(e);
    });

//MyModel.Customer.findByPk(1).then(c => {		
MyModel.Customer.findOne( { where : { id : 1} } ).then(c => {	
        //on récupère ici l'unique Customer recherchée par sont id (primary key)
        console.log("** Customer avec id=1 : " + JSON.stringify(c));
    }).catch(function (e) {
        console.log(e);
    });	
/*
/*	
MyModel.Customer.destroy({  where: { id: 3 }}).then(() => {
  console.log("Customer avec id=3 supprimé");
}).catch(function (e) {
     console.log(e);
 });

MyModel.Customer.findAll().then(customers => {	
        console.log("*** Customers :" + JSON.stringify(customers));
    }).catch(function (e) {
        console.log(e);
    }); 
*/
}


function doJob1WithSequelize(){
console.log("... doJob1WithSequelize ... Customer ... CRUD sequence");
//TESTS ELEMENTAIRES SYNCHRONISES (via Promise .then .then .catch)

let c1,c2,c3;
deleteAllPromise("Customer").
then(()=>MyModel.Customer.create({id:null, firstName: 'Jean', lastName: 'Bon', phoneNumber : '0605040302',    email: 'jean.bon@charcuterie.fr'  }))
.then((c) => { c1 = c; 
      return MyModel.Customer.create({id:null, firstName: 'Alex', lastName: 'Therieur', 
	  phoneNumber : '0605040301',    email: 'alex.therieur@charcuterie.fr'  });
})
.then((c) => { c2 = c; 
	return MyModel.Customer.create({id:null, firstName: 'Alain', lastName: 'Therieur',
         phoneNumber : '0608040301',    email: 'alex.therieur@charcuterie.fr'  });
})
.then((c) => { c3 = c;  })
.then(() => /* implicit return without {} */MyModel.Customer.findAll())
.then(customers => {	
        console.log("*** Customers :" + JSON.stringify(customers));
    }) 
.then(()=>MyModel.Customer.update({phoneNumber: '0606060606'},
                                  {where: {id: c1.id}})
 )
.then(nbCustomersModifies => {
        console.log("nbCustomersModifies:" + nbCustomersModifies);
		return MyModel.Customer.findByPk(c1.id);
    })
.then(c => console.log("** updated Customer avec id=1 : " + JSON.stringify(c))
    )
.catch((e) =>{  console.log(e); })

}

async function doJob1WithSequelizeAndAsyncAwait(){
console.log("... doJob1WithSequelizeAndAsyncAwait ... Customer ... CRUD sequence");
//TESTS ELEMENTAIRES SYNCHRONISES (via async/await )

try{
await deleteAllPromise("Customer");
let c1= await MyModel.Customer.create({id:null, firstName: 'Jean', lastName: 'Bon', 
      phoneNumber : '0605040302',  email: 'jean.bon@charcuterie.fr'  });
let c2 = await MyModel.Customer.create({id:null, firstName: 'Alex', lastName: 'Therieur', 
	  phoneNumber : '0605040301',    email: 'alex.therieur@charcuterie.fr'  });
let c3 = await MyModel.Customer.create({id:null, firstName: 'Alain', lastName: 'Therieur',
         phoneNumber : '0608040301',    email: 'alex.therieur@charcuterie.fr'  });
const customers = await MyModel.Customer.findAll();	
console.log("### Customers :" + JSON.stringify(customers));
let nbCustomersModifies = await MyModel.Customer.update({phoneNumber: '0606060606'},
                                  {where: {id: c1.id}});
console.log("nbCustomersModifies:" + nbCustomersModifies);
c1= await MyModel.Customer.findByPk(c1.id);
console.log("## updated Customer avec id=1 : " + JSON.stringify(c1))
}
catch(e){
	console.log(e); 
}
	

}


function deleteAllPromise(modelClassName){
	return MyModel[modelClassName].destroy({ where: {} });
}

function doJob2WithSequelize(){
	
   let ac1 , ac2 ;	
	
   deleteAllPromise("Account")
	.then(()=> deleteAllPromise("Operation"))
	.then( () => MyModel.Account.create({number:null, label: 'bank_account_xx', balance : 100.0  }) )
    .then( (ac) => { ac1=ac; 
	        return MyModel.Operation.create({number:null, label: 'achat x1', amount : -50.0 , dateOp:"2019-05-23"  });
	})
	.then((newOp) => ac1.addOperation(newOp))//.addOperation() --- Account.hasMany(Operation);	
	.then( () => MyModel.Operation.create({number:null, label: 'achat x2', amount : -40.0 , dateOp:"2019-05-22"  }))
	.then((newOp) => ac1.addOperation(newOp))
	.then( () => MyModel.Account.create({number:null, label: 'bank_account_yy', balance : 50.0  } ))
	.then( (ac) => { ac2=ac; 
	        return MyModel.Operation.create({number:null, label: 'achat y1', amount : -30.0 , dateOp:"2019-05-21"  });
	})
	.then((newOp) => ac2.addOperation(newOp))
	.then( () => MyModel.Operation.create({number:null, label: 'achat y2', amount : -150.0 , dateOp:"2019-05-20"  }))
	.then((newOp) => ac2.addOperation(newOp))
	.then(()=> MyModel.Account.findAll( { include: [{model: MyModel.Operation} ] }))
    //	{ include: [{model: MyModel.Operation} ] }  to fetch JOINED operations for each account --- Account.hasMany(Operation);                    
	.then(accounts => {
        //console.log("*** accounts =" + JSON.stringify(accounts));
		accounts.forEach((account) => {
            //console.log("** account =" + JSON.stringify(account));
			console.log(`* account ${account.number} ${account.label} ${account.balance} `);
			//.operations --- Account.hasMany(Operation);
			account.operations.forEach((op) => {
			   console.log(`***** operation ${op.number} ${op.label} ${op.amount} ${op.dateOp}`);
			});
        });
    })
	//.then(()=> MyModel.Operation.findAll())
	//.then(()=> MyModel.Operation.findAll( { include: [{model: MyModel.Account } ] }))
	//{ include: [{model: MyModel.Account} ] }  to fetch JOINED account ---  Operation.belongsTo(Account);
	.then(()=> MyModel.Operation.findAll( { where : { AccountNumber : ac1.number } } ))
	.then(operations => {
        console.log("*** operations =" + JSON.stringify(operations));
	})
	.catch(function (e) {
        console.log(e);
    });	
	
	
 
}
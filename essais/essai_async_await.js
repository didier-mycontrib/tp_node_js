function strDateTime() {
	return (new Date()).toLocaleString();
}


function myGenericTimeoutPromise(initCb,delay){
	//new Promise(resolve [, reject]) since es6
  return new Promise (
  (resolve) => {
	setTimeout (()=> { return resolve(initCb());} 
	           , delay);
  });
}

const affDiffere = () => {
	/*myGenericTimeoutPromise(()=> {console.log("after 2000 ms " + strDateTime());} , 2000)
     .then(()=> {console.log("ok"); });*/
	 myGenericTimeoutPromise(()=> {return("after 2000 ms " + strDateTime());} , 2000)
     .then((message)=> {console.log("ok - " + message); });
};

  
async function getUserFromIdAsAutomaticPromise(id){
	//return resultat in async function (since es8 / es2017)
	//is equivalent to new Promise.resolve(resultat);
	//throw new Error('erreur') in async function (since es8 / es2017)
	//is equivalent to new Promise.reject('erreur');
	
	const user =  await myGenericTimeoutPromise( 
	                    ()=> { return { name : "toto" };}, 2000);
	if(id) return user; //as promise (automatic new if necessary)
		else throw new Error("id should not be null!");
}

  
async function getAddressFromNameAsAutomaticPromise(name){
	//new Promise(resolve, reject) since es6
	//return resultat in async function (since es8 / es2017)
	//is equivalent to new Promise.resolve(resultat);
	//throw new Error('erreur') in async function (since es8 / es2017)
	//is equivalent to new Promise.reject('erreur');
	  
	const address =  await myGenericTimeoutPromise( 
	                   ()=> { return { adr : "75000 Paris for name="+name }; } , 1500);
	return address; //as promise (automatic new if necessary)
}  
  

console.log("debut :" + strDateTime()  );
affDiffere();

function appelsClassiquesPromises(){
getUserFromIdAsAutomaticPromise(1)
//getUserFromIdAsAutomaticPromise(null)
   .then( (user) => {   console.log("username=" + user.name);
						//returning new Promise for next then() :
                        return getAddressFromNameAsAutomaticPromise(user.name);   
					})
   .then( (address) => { console.log("address=" + address.adr ); } )
   .catch( (err) => { console.log("my error:" + err.message); } );
}

async function appelsViaAwait(){
  try{
	  const user = await getUserFromIdAsAutomaticPromise(1);
	  //const user = await getUserFromIdAsAutomaticPromise(null);
	  console.log("username=" + user.name);
	  const address = await getAddressFromNameAsAutomaticPromise(user.name);   
	  console.log("address=" + address.adr ); 
  }
  catch(err){ 
      console.log("my error:" + err); 
  } 
}

//appelsClassiquesPromises();
appelsViaAwait()
//.catch( (err) => { console.log("my error:" + err); } );

   
console.log("suite :" + strDateTime()  );


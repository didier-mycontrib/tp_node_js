function strDateTime() {
	return (new Date()).toLocaleString();
}

const affDiffere = () => {
	setTimeout (()=> {console.log("after 2000 ms " + strDateTime());} , 2000);
};

const getUserInCb = 
  (cbWithName) => {
	setTimeout (()=> { return cbWithName({ name : "toto" });} , 2000);
  };
  
function getUserFromIdAsPromise(id){
	//new Promise(resolve, reject) since es6
  return new Promise (
  (resolveCbWithName,rejectCb) => {
	setTimeout (()=> { if(id) return resolveCbWithName({ name : "toto" });
	                    else return rejectCb("id should not be null!");
	                 } 
	           , 2000);
  });  
}

const getAddressFromNameInCb = 
 (name , cbWithAddress)  => {
	setTimeout (()=> { return cbWithAddress({ adr : "75000 Paris for name="+name });} , 1500);
  };
  
function getAddressFromNameAsPromise(name){
	//new Promise(resolve, reject) since es6
  return new Promise (
  (resolveCbWithAddress) => {
	setTimeout (()=> { return resolveCbWithAddress({ adr : "75000 Paris for name="+name });} , 1500);
  });  
}  
  

console.log("debut :" + strDateTime()  );
affDiffere();

/*
getUserInCb(
   (user) => { 
   console.log("username=" + user.name); 
   getAddressFromNameInCb(user.name, 
       (address) => { console.log("address=" + address.adr );  }
	   );
   }
   );
*/

getUserFromIdAsPromise(1)
//getUserFromIdAsPromise(null)
   .then( (user) => {   console.log("username=" + user.name);
						//returning new Promise for next then() :
                        return getAddressFromNameAsPromise(user.name);   
					})
   .then( (address) => { console.log("address=" + address.adr ); } )
   .catch(error => { console.log("error:" + error); } );
   

   
console.log("suite :" + strDateTime()  );


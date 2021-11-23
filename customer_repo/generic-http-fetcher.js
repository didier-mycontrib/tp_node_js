//generic-http-fetcher (based on axios)
const https = require('https');
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const axios = require('axios'); //pour appeler des WS REST avec des Promises
//url =  first mandatory param
//mode (optional)= 'get' by default or 'post' or ...
//inputData (optional , as js) : for post or put
//inputHeaders  (optional , as js) : {} or ...
//defaultValueIfError (optional , as js)
//returning Promise with responseData or Error
async function myGenericJsonFetch(url,mode,inputData,inputHeaders,defaultValueIfError){
	let responseData= null;
	if(mode==null) mode = 'get' ; //par defaut
	if(inputHeaders==null) inputHeaders = {} ; //par defaut
	try {
		console.log("in myGenericJsonFetch mode="+mode+ " url="+url + " inputData=" + JSON.stringify(inputData));
		const response = await axios({
			httpsAgent: new https.Agent({  
               rejectUnauthorized: false
            }),
			method: mode ,
			url : url ,
			data : inputData
		});
		//console.log(response);
		if(response.status==200 || response.status==201){
			responseData = response.data;
		   }
		 return responseData;
	}catch(ex){
		console.log("in myGenericJsonFetch, ex=" + ex); 
		if(defaultValueIfError) return defaultValueIfError;
		else throw {error : "cannot fetch" , cause : ex};
	}
}


module.exports.myGenericJsonFetch = myGenericJsonFetch ;

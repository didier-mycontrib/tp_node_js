var stdin = process.stdin;
var stdout = process.stdout;

function ask_(question) {
	return new Promise ((resolve,reject)=> {
		stdin.resume();
		stdout.write(question + ": ");
		stdin.once('data', function(data) {
			data = data.toString().trim();
			if(data=="fin")
				reject("end/reject");
			else
			  resolve(data);
		});
	});
}


async function ask_and_compute_x_plus_y(){
	try{
		let x,y;
		const valX = await ask_("x"); x=Number(valX);
		const valY = await ask_("y"); y=Number(valY);
		let xPlusY=x+y ;console.log("(x+y)=" +xPlusY); 
		return xPlusY;
		//return resultat in async function (since es8 / es2017)
		//is equivalent to new Promise.resolve(resultat);
	}
	catch(e){
		console.log(e);
		throw new Error("xPlusY-error:"+e);
		//throw new Error('erreur') in async function (since es8 / es2017)
		//is equivalent to new Promise.reject('erreur');
	}
}


async function x_plus_y_mult_z(){
	try{
		/*
		const valX = await ask_("x"); let x=Number(valX);
		const valY = await ask_("y"); let y=Number(valY);
		let xPlusY=x+y ;console.log("(x+y)=" +xPlusY); 
		*/
		const xPlusY = await ask_and_compute_x_plus_y();
		const valZ = await ask_("z"); const z=Number(valZ);
		let res=xPlusY * z ;console.log("(x+y)*z=" +res);
	}
	catch(e){
		console.log(e);
	}
    process.exit();	
}

x_plus_y_mult_z();

/*
var x,y,z; //(x+y)*z
ask_("x")
.then((valX)=>{ x=Number(valX); return ask_("y");})
.then((valY)=> { y=Number(valY); let res=x+y ;
				console.log("(x+y)=" +res);
				return ask_("z");
			   })
.then((valZ)=> { z=Number(valZ); let res=(x+y)*z ;
				console.log("(x+y)*z=" +res);
				process.exit();
			   })			   
.catch((err)=>{console.log(err);process.exit();});
*/

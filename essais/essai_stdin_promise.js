var stdin = process.stdin;
var stdout = process.stdout;
/*
function ask(question, callback) {
	stdin.resume();
	stdout.write(question + ": ");
	stdin.once('data', function(data) {
		data = data.toString().trim();
		callback(data);
	});
}
//utilisation chaînée avec callbacks imbriquées:
ask("x", function(valX){
		var x=Number(valX);
		ask("y", function(valY){
					var y=Number(valY);
					var res=x+y ;
					console.log("res = (x+y)=" +res);
					process.exit();
				});
});
*/


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

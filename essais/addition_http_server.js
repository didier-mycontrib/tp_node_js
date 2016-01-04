//modules to load:
var http = require('http'); 
var url = require('url');
var querystring = require('querystring')
var EventEmitter = require('events').EventEmitter;
var mycomputer_module = require('./mycomputer_module'); // ./ for searching in local relative

var myOpEventMgr = new EventEmitter();

var myHttpFunction = function(req, res) {
  res.writeHead(200 , {"Content-Type": "text/html"}); //OK=200
  res.write("<html> <body>");
  var params= querystring.parse(url.parse(req.url).query);
  var operation = url.parse(req.url).pathname;
  console.log("operation=" + operation);
  if(operation=='/addition'){
	  a=Number(params['a']);
	  b=Number(params['b']);
	  //result=a+b;
	  //resultString = "" + a + "+" + b +"=" + result;
	  resultString = mycomputer_module.myAddStringFct(a,b);
	  myOpEventMgr.emit('add',resultString); //emettre l'evenement 'add'
	  res.write(resultString);
  }
  res.write("</body></html>");
  res.end();
};

myOpEventMgr.on('add' , function(message){
	console.log('add event with message=' +message);
});

var server = http.createServer();
server.on('request',myHttpFunction);

server.on('close',function(){
	console.log('server is stopped')
});
server.listen(8282);  //http://localhost:8282/addition?a=2&b=3
console.log('server is started , listening for http://localhost:8282/addition?a=2&b=3 request');
//server.close();
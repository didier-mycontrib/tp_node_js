//var http = require('http'); //ancienne syntaxe cjs
import http from 'http'; //module es2015 , typescript ou javascript

var myHttpFunction = function(req, res) {
  res.writeHead(200 , {"Content-Type": "text/html"}); //OK=200
  res.write("<html> <body> <b> hello world </b> </body></html>")
  res.end();
};

var server = http.createServer(myHttpFunction);
server.listen(8282);  
console.log("http://localhost:8282");
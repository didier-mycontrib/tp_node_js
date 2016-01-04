//modules to load:
var http = require('http'); 
var url = require('url');
var querystring = require('querystring')
var EventEmitter = require('events').EventEmitter;


var myHttpFunction = function(req, res) {
  res.writeHead(200 , {"Content-Type": "text/html"}); //OK=200
  res.write("<html> <body>");
  res.write('ok');
  res.write("</body></html>");
  res.end();
};


var server = http.createServer();
server.on('request',myHttpFunction);


server.listen(8282);  //http://localhost:8282
console.log('server is started , listening for http://localhost:8282');

//var http = require('http'); //ancienne syntaxe cjs
//var url = require('url'); 
import http from 'http'; //module es2015 , typescript ou javascript
import url from 'url';

var myHttpFunction = function(req , res ) {
  res.writeHead(200 , {"Content-Type": "text/html"}); //OK=200
  res.write("<html> <body>");
  var pathName= url.parse(req.url).pathname; // "/" ou "/p1" ou "/p2"
  res.write("<p>pathName=<i>"+pathName+"</i></p><hr/>");
  switch(pathName){
    case '/p1' :
       res.write("<b> partie 1 </b>");    break;
    case '/p2':
       res.write("<b> partie 2 </b>");    break;
    case "/":
    default:
      res.write("<b> hello world </b><br/>");
      res.write("<a href='p1'>p1</a><br/>");
      res.write("<a href='p2'>p2</a><br/>");
  }
  res.write("</body></html>");
  res.end();
};
var server = http.createServer(myHttpFunction);  
server.listen(8282); 
console.log("http://localhost:8282");
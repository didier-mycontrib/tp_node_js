//modules to load:
//var express = require('express');
import express from 'express' ;


var app = express();
//express framework manage basic route in server side 
//with app.get() , app.post() , app.delete() , ...


app.get('/', function(req, res , next) {
    res.setHeader('Content-Type', 'text/html');
    res.write("<html> <body>");
	res.write('<p>index (welcome page) of simpleApp</p>');
	res.write('<a href="addition?a=5&b=6">5+6</a>');
	res.write("</body></html>");
	res.end();
});

//GET addition?a=5&b=6
app.get('/addition', function(req, res , next) {
	let a = Number(req.query.a);
	let b = Number(req.query.b);
	let resAdd = a+b;
	res.setHeader('Content-Type', 'text/html');
    res.write("<html> <body>");
	res.write('a=' + a + '<br/>');
	res.write('b=' + b + '<br/>');
	res.write('a+b=' + resAdd + '<br/>');
	res.write("</body></html>");
	res.end();
});


app.listen(8282 , function () {
  console.log("simple express node server listening at 8282");
  console.log("http://localhost:8282");
});

var express = require('express');
var app = express();

var container = require('rhea');

container.on('message', function (context) {
    console.log(context.message.body);
    //context.connection.close();
});

container.once('sendable', function (context) {
	var msgProps = { _type : 'org.mycontrib.xyz.dto.MyData' };
	var objData = { ref : 'r2' , value : 1234 };
    context.sender.send({ application_properties: msgProps , 
	                      body: JSON.stringify(objData) });
});
//ActiveMq or Artemis have this defaults ports:
//5672 for AMQP (Advanced Message Queuing Protocol)
//8161 for admin console
//61616 for tcp JMS (java)
var connection = container.connect({host: 'localhost' , port:5672 , username: 'admin', password: 'admin' });
connection.open_receiver('MyForwardDataQueue');
connection.open_sender('MyDataQueue');

// GET http://localhost:8585/essai1
app.get("/essai1", function(req, res,next) {
	var objData = {
		ref : "ref1",
		value : 12
	};
	res.send(objData);
});


app.listen(8585,function () {
	console.log("http://localhost:8585");
});

// node server.js
// ou bien 
// npm install nodeamon
// nodeamon server.js

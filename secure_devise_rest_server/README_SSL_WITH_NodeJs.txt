
openssl genrsa -out key.pem
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
rm csr.pem
======================

var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('key.pem', 'utf8'); //or sslcert/server.key
var certificate = fs.readFileSync('cert.pem', 'utf8'); //or sslcert/server.crt

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();

// your express configuration here

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8000);//80
httpsServer.listen(4430);//443 (443 = en prod = nécessite droit "root" au démarrage de node js)

===================
ou bien utilisation du module "pem" de node-js pour générer des "key.pem , cert.pem" à la volée (ex: au démarrage)
======================
var https = require('https'),
    pem = require('pem'),
    express = require('express');

pem.createCertificate({days:1, selfSigned:true}, function(err, keys){
  var app = express();

  app.get('/',  requireAuth, function(req, res){
    res.send('o hai!');
  });

  https.createServer({key: keys.serviceKey, cert: keys.certificate}, app).listen(443);
});
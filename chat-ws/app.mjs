import express from 'express';
import my_websockets from './my_websockets.mjs';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express(); //express server

//les routes en /html/... seront gérées par express par
//de simples renvois des fichiers statiques du répertoire "./html"
app.use('/html', express.static(__dirname+"/html"));
app.get('/', function(req , res ) {
  res.redirect('/html/index.html');
});

//start express server:
const expressServer = app.listen(5000, 
  () => console.log('http://localhost:5000')
);

const ws_server = my_websockets.ws_server;

//upgrade express server to "http + ws" server:
//détails sur https://www.npmjs.com/package/ws
expressServer.on('upgrade', (request, socket, head) => {
  ws_server.handleUpgrade(request, socket, head, socket => {
    ws_server.emit('connection', socket, request);
  });
});

//node app.mjs

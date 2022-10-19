
import express  from 'express';
import http from 'http';
import my_socket_io from './my_socket_io.mjs';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const  app  = express();

//les routes en /html/... seront gérées par express
//par de simples renvois des fichiers statiques du répertoire "/html"
app.use('/html', express.static(__dirname+"/html"));

app.get('/', function(req , res  ) {
    res.redirect('/html/index.html');
  });

const server = http.createServer(app);
const io = my_socket_io.initSocketIO(server);
server.listen(8383,function () {
    console.log("http://localhost:8383");
  });

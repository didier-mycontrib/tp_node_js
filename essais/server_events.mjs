import express from 'express';
var app = express();

import xyApiRoutes from './with-fire-event.mjs';
import ccApiRoutes from './with-event-handler.mjs';

app.use(xyApiRoutes.apiRouter);
app.use(ccApiRoutes.apiRouter);

let backendPort = process.env.PORT || 8282; 
app.listen(backendPort , function () {
  console.log("http://localhost:"+backendPort);
});

/*
node server_events.mjs
http://localhost:8282/api-cc/comment 
http://localhost:8282/api-xy/xx (à appeler 2 ou 3 fois dans autre onglet)
http://localhost:8282/api-cc/comment
http://localhost:8282/api-xy/xx (à encore appeler quelques fois)
http://localhost:8282/api-cc/comment
*/
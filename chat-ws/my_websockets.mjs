import { WebSocketServer }  from 'ws';
//détails sur https://www.npmjs.com/package/ws

//if { port : 6000 , path : "/ws" } , two differents ports for express and websocket : it's work
//if { noServer: true , path : "/ws" } need to call expressServer.on('upgrade', (request, socket, head) => { ..} on express server AND just one port
//creating ws_server that will be attached to express server --> ws://localhost:5000/ws
const ws_server = new WebSocketServer({ noServer : true ,  path : "/ws" });

ws_server.on('connection', (ws) => {
  console.log('New client connected!');

  ws.on('message', (data) => {
    //console.log("received message=" + data);
    let objData = JSON.parse(data);
    switch(objData.type){
      case 'chat_message' :
         // Dès qu'on reçoit un message, 
        //on récupère le pseudo de son auteur 
        //et on le transmet aux autres personnes
        broadcast_json_message_to_others(ws,{ type: "chat_message" , pseudo : ws.pseudo , message : objData.message });
          break;
      case  'nouveau_client' :
        //Dès qu'on nous donne un pseudo, 
        //on le stocke en variable de session et on informe les autres personnes
        ws.pseudo = objData.pseudo;
        broadcast_json_message_to_others(ws,{ type: "nouveau_client" , pseudo : objData.pseudo });
         break;
  }
  });

  ws.on('close', () => console.log('Client has disconnected!'));
});

function broadcast_json_message_to_all(objData){
  broadcast_message_to_all(JSON.stringify(objData));
}

function broadcast_message_to_all(message){
  ws_server.clients.forEach((client) => {
    client.send(message);
  });
}

function broadcast_json_message_to_others(currWs,objData){
  broadcast_message_to_others(currWs,JSON.stringify(objData));
}

function broadcast_message_to_others(currWs,message){
  ws_server.clients.forEach((client) => {
    if(client != currWs)
       client.send(message);
  });
}

setInterval(() => {
  broadcast_json_message_to_all({ type: "timestamp" , info : new Date().toTimeString() });
}, 5000);




export default { ws_server };
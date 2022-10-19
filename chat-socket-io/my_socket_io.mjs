
import ent from 'ent';// Permet de bloquer les caractères HTML
import  { Server } from 'socket.io'; 

function initSocketIO(server){
    let io = new Server(server);
    my_io_settings(io);
    return io;
}

function my_io_settings(io){
    //events: connection, message , disconnect and custom_event like nouveau_client

    io.on('connection', function (socket) {
        // Dès qu'on nous donne un pseudo, 
        //on le stocke en variable de session et on informe les autres personnes
        socket.on('nouveau_client', function(pseudo) {
            pseudo = ent.encode(pseudo);
            socket.pseudo = pseudo;
            socket.broadcast.emit('nouveau_client', pseudo);
        });

        // Dès qu'on reçoit un message, 
        //on récupère le pseudo de son auteur 
        //et on le transmet aux autres personnes
        socket.on('message', function (message) {
            message = ent.encode(message);
            socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
        });
});

}

export default { initSocketIO };

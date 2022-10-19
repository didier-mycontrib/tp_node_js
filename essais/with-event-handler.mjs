import express from 'express';
import with_fire_event from './with-fire-event.mjs';

const apiRouter = express.Router();

var comment = "no comment";
// .on() ré-appelé à chaque nouvelle occurrence de l'événement
with_fire_event.counterEventEmitter.on('new-counter', function(evt){
    console.log("received event: " + JSON.stringify(evt));
    comment = "new-counter="+evt.counter;
});

// .once() appelé qu'au moment de la première occurrence de l'événement
with_fire_event.counterEventEmitter.once('new-counter', function(evt){
    console.log(">>> new-counter now not 0: " + JSON.stringify(evt));
});

apiRouter.route('/api-cc/comment')
.get( function(req , res  , next ){
    res.send([ { timestamp: (new Date()).toISOString() , comment : comment}  ]);
});

export  default { apiRouter };
import events from'events';
import express from 'express';

const apiRouter = express.Router();
var counterEventEmitter = new events.EventEmitter();

var counter = 0;

apiRouter.route('/api-xy/xx')
.get( function(req , res  , next ){
    counter++;
    counterEventEmitter.emit('new-counter',{counter:counter});
    console.log("new-counter event was fire with counter="+counter)
    res.send([ { id: 1 , message : "xx1" } , { id: 2 , message : "xx2" } ]);
});

export  default { apiRouter , counterEventEmitter};

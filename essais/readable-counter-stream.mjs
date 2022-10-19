import { Readable , Writable ,Transform , pipeline} from 'stream';

class ReadableCounterStream extends Readable {
    constructor(){
        super({ encoding: 'utf8' }); //default highWaterMark = 16kb (a little like back pressure)
        this.data = 0; //counter
    }

    //nb: _read() will not be call directly , but via node.
    _read() {
        this.data += 1;
        if (this.data <= 5) {
            const chunk = this.data.toString();
            //console.log("_read() was called with chunk="+chunk)
            this.push(chunk);
        } else {
            this.push(null); //push null to say "end of stream"
        }
    }
}

class WritableLoggerStream extends Writable {
    _write(chunk, encoding, next) {
    console.log(`internal buffer length=${this.writableLength} chunk=${chunk}`);
    next(); //indiquer "près pour récupérer le prochain chunk"
    }
}

function simpleUse_flowingMode1(){
   const myReadableCounterStream = new ReadableCounterStream();
   //NB: l'état initial d'un readable stream est sensé être en mode paused
   myReadableCounterStream.pause(); //demande explicite du mode "paused"
   console.log("after .pause() , isPaused():" + myReadableCounterStream.isPaused());
   //flowing mode is like a websocket push
   myReadableCounterStream.on('data', chunk => {
    console.log("data chunk=" + chunk);
   });
   myReadableCounterStream.resume(); //inverse of pause (flowing mode)
   console.log("after .resume() , isPaused():" + myReadableCounterStream.isPaused());
  
}

function simpleUse_pauseMode1(){
    const myReadableCounterStream = new ReadableCounterStream();

    myReadableCounterStream.on('readable', () => {
        let chunk;
        //calling .read() (without _) in paused mode is like a polling rest call
        while ((chunk = myReadableCounterStream.read()) !== null) {
            console.log("readable data chunk=" + chunk);
        }
        });
 }

 function simpleWritableUse1(){
    const myWritableLoggerStream = new WritableLoggerStream();
    let data = 0; //compteur (de 0 à 5)
    let feedStream = () => {
        data += 1;
        
        if (data < 5) {
            const isNowStillWritable = myWritableLoggerStream.write(data.toString()); //write() without _
            if (isNowStillWritable) {
               setTimeout(feedStream, 50);//next asynchronous sent after 50ms
            }else{
                //'drain' event will be fired by stream when 'writable' in the future
                myWritableLoggerStream.once('drain', feedStream);
            }
        } else {
            myWritableLoggerStream.end(data.toString());//last sent with data or empty load
        }
    }
        
    feedStream();
 }

 function simpleReadablePipeWritableUse1(){
    const myReadableCounterStream = new ReadableCounterStream();
    myReadableCounterStream.on('error',(err) => {console.error(err.message);});
    const myWritableLoggerStream = new WritableLoggerStream();
    myWritableLoggerStream.on('error',(err) => {console.error(err.message);});
    myReadableCounterStream.pipe(myWritableLoggerStream);
 }

 function simplePipeWithTransformUse1(){
    const myReadableCounterStream = new ReadableCounterStream();
    const myWritableLoggerStream = new WritableLoggerStream();

    const multByTwoTransform = new Transform({
        transform(chunk, encoding, callback) {
          callback(null, (chunk *  2).toString());
        },
      });

    myReadableCounterStream.pipe(multByTwoTransform).pipe(myWritableLoggerStream);
 }


 function simpleReadablePipelineWritableUse1(){
    const myReadableCounterStream = new ReadableCounterStream();
    const myWritableLoggerStream = new WritableLoggerStream();
    //pipeline() of 'streams' module pour mutualiser le traitement des erreurs
    pipeline(myReadableCounterStream ,myWritableLoggerStream ,
             (err) => { if(err) console.error(err.message);} )
 }

 function bufferExample(){
    const s1 = "vidéo";
    console.log("s1.length="+s1.length); //5

    const buffer = Buffer.from(s1, "utf8");
    console.log("buffer.length="+buffer.length); //6 car é codé en utf8 sur 2 octets

    const bytes = Array.from(buffer.values());
    console.log("bytes=" + bytes); // 118,105,100,195,169,111

    const s2 = Buffer.from(bytes).toString();
    console.log("s2="+s2); // "vidéo"
 }

//simpleUse_flowingMode1();
//simpleUse_pauseMode1();
//simpleWritableUse1();
//simpleReadablePipeWritableUse1();
//simplePipeWithTransformUse1();
//simpleReadablePipelineWritableUse1();
bufferExample();

//node readable-counter-stream.mjs
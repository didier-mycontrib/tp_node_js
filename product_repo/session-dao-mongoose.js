var mongoose = require('mongoose');
mongooseAutoIncrement = require('mongoose-auto-increment');

var mongoDbUrl = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017"; //by default

//NB: This is for current entity type ("Devise" or "Customer" or "Product" or ...)
//NB: thisSechema end ThisPersistentModel should not be exported (private only in this current module)
var thisSchema;//mongoose Shcema (structure of mongo document)
var ThisPersistentModel; //mongoose Model (constructor of persistent ThisPersistentModel)


var initMongooseWithSchemaAndModel = function(callbackWithPersistentModel) {
    console.log("mongoDbUrl="+mongoDbUrl);
    mongoose.connect(mongoDbUrl, {useNewUrlParser: true, useUnifiedTopology: true , dbName : 'session'});
    const db = mongoose.connection;
    mongooseAutoIncrement.initialize(db);

    db.on('error' , function() { console.log("mongoDb connection error = " + " for dbUrl=" + mongoDbUrl )});
    db.once('open', function() {
      // we're connected!
      console.log("Connected correctly to mongodb database" );
      thisSchema = new mongoose.Schema({
        /* default mongo _id: { type : String , alias : "id" } ,*/
        _id: { type : Number , alias : "id" } ,
        title: String,
        date : String,
        startTime : String,
        unitPrice : Number,
        description : String,
        maxNbPlaces : Number
      });
      thisSchema.set('id',false); //no default virtual id alias as string for _id
      thisSchema.set('toJSON', { virtuals: true , 
                                   versionKey:false,
                                   transform: function (doc, ret) {   delete ret._id; delete ret._v;  }
                                 });
      thisSchema.plugin(mongooseAutoIncrement.plugin, {
                                  model: 'Session',
                                  field: '_id' /* _id by default*/ ,
                                  startAt: 1,
                                  incrementBy: 1
                              });                                
      //console.log("mongoose thisSchema : " + JSON.stringify(thisSchema) );
      //"Session" model name is "Session" collection name in mongoDB test database
      ThisPersistentModel = mongoose.model('Session', thisSchema);
      
      //console.log("mongoose PersistentSessionModel : " + ThisPersistentModel );
      if(callbackWithPersistentModel)
         callbackWithPersistentModel(ThisPersistentModel);
    });
}


function reinit_db(){
  return new Promise( (resolve,reject)=>{
      const deleteAllFilter = { }
      ThisPersistentModel.deleteMany( deleteAllFilter, function (err) {
        if(err) { 
          console.log(JSON.stringify(err));
          reject(err);
        }
        //insert elements after deleting olds
        (new ThisPersistentModel({ id : 1 , title : "La flute enchantee" , date : "2022-01-12" , startTime : "15:30" , unitPrice : 30 , description : "Opera de Mozart" , maxNbPlaces : 300})).save();
        (new ThisPersistentModel({ id : 2 , title : "La traviata" , date : "2022-02-20" , startTime : "18:30" , unitPrice : 30 , description : "Opera de Verdi" , maxNbPlaces : 300})).save();
        resolve({action:"session database re-initialized"})
      })
  });
}

function findById(id) {
  return new Promise( (resolve,reject)=>{
	ThisPersistentModel.findById( id ,
									    function(err,entity){
                        if(err) reject({error:'can not find by id' , cause : err});
                        else if(entity == null) reject({error:'NOT_FOUND' , reason : "no session found with id="+id});
                          else resolve(entity);
									   });
  });
}



//exemple of criteria : {} or { unitPrice: { $gte: 25 } } or ...
function findByCriteria(criteria) {
  return new Promise( (resolve,reject)=>{
	ThisPersistentModel.find( criteria ,
									    function(err,entities){
                        if(err) reject({error:'can not find' , cause :err });
                        else  resolve(entities);
									   });
  });
}

function save(entity) {
  return new Promise( (resolve,reject)=>{
    let  persistentEntity = new ThisPersistentModel(entity);
    persistentEntity.save( function(err,savedEntity){
                        if(err != null) reject(
                          {error : "cannot insert in database" , cause : err});
                        else {
                          entity.id = savedEntity.id;
                          resolve(entity);
                        }
									   });
  });
}

function updateOne(newValueOfEntityToUpdate) {
  return new Promise( (resolve,reject)=>{
    const filter = { _id :  newValueOfEntityToUpdate.id  };
    //console.log("filter of updateOne=" +JSON.stringify(filter));
    ThisPersistentModel.updateOne(filter , newValueOfEntityToUpdate,
                       function(err,opResultObject){
                         console.log("opResultObject of updateOne=" +JSON.stringify(opResultObject))
                        if(err) reject({ error : "cannot updateOne " , cause :  err});
                        else if(opResultObject.matchedCount == 1)
                           resolve(newValueOfEntityToUpdate);
                        else reject({ error : "NOT_FOUND" , reason : "no session to update with id=" + newValueOfEntityToUpdate.id });
									   });
  });
}

function deleteOne(idOfEntityToDelete) {
  return new Promise( (resolve,reject)=>{
    const filter = { _id : idOfEntityToDelete };
    console.log("filter of deleteOne=" +JSON.stringify(filter));
    ThisPersistentModel.deleteOne(filter ,
                       function(err,opResultObject){
                        console.log("opResultObject of deleteOne=" +JSON.stringify(opResultObject))
                        if(err) reject({ error : "cannot delete " , cause :  err});
                        else if(opResultObject.deletedCount == 1) resolve({ deletedId : idOfEntityToDelete });
                          else reject({ error : "NOT_FOUND" , reason : "no session to delete with id=" + idOfEntityToDelete });
									   });
  });
}

module.exports.initMongooseWithSchemaAndModel=initMongooseWithSchemaAndModel;
module.exports.reinit_db = reinit_db;
module.exports.findById = findById ;
module.exports.findByCriteria = findByCriteria ;
module.exports.save = save ;
module.exports.updateOne = updateOne ;
module.exports.deleteOne = deleteOne ;

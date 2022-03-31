var mongoose = require('mongoose');
var sessionDbMongoosee = require('./session-db-mongoose');
var genericPromiseMongoose = require('./generic-promise-mongoose');//generic helper for entity model with  .id , ._id

var thisDb = sessionDbMongoosee.thisDb;

//NB: This is for current entity type ("Devise" or "Customer" or "Product" or ...)
//NB: thisSechema end ThisPersistentModel should not be exported (private only in this current module)
var thisSchema;//mongoose Shcema (structure of mongo document)
var ThisPersistentModel; //mongoose Model (constructor of persistent ThisPersistentModel)

function initMongooseWithSchemaAndModel () {

    //default auto generated objectId of mongoDB is better than number auto_incr
    //because it is more unique (no problem with objectId, but risk of same id  if auto_incr is reset)
   
    mongoose.Connection = thisDb;
      thisSchema = new mongoose.Schema({
        /* default mongo _id: { type : String , alias : "id" } ,*/
        title: String,
        date : String,
        startTime : String,
        unitPrice : Number,
        description : String,
        maxNbPlaces : Number
      });
      thisSchema.set('id',true); //virtual id alias as string for _id
      thisSchema.set('toJSON', { virtuals: true , 
                                   versionKey:false,
                                   transform: function (doc, ret) {   delete ret._id; delete ret._v;  }
                                 });                             
      //console.log("mongoose thisSchema : " + JSON.stringify(thisSchema) );
      //"Session" model name is "sessions" collection name in mongoDB session_db database
      ThisPersistentModel = mongoose.model('Session', thisSchema);
}

initMongooseWithSchemaAndModel();

function reinit_db(){
  return new Promise( (resolve,reject)=>{
      const deleteAllFilter = { }
      ThisPersistentModel.deleteMany( deleteAllFilter, function (err) {
        if(err) { 
          console.log(JSON.stringify(err));
          reject(err);
        }
        //insert elements after deleting olds
        (new ThisPersistentModel({ _id : '618d53514e0720e69e2e54c8' ,title : "La flute enchantee" , date : "2022-01-12" , startTime : "15:30" , unitPrice : 30 , description : "Opera de Mozart" , maxNbPlaces : 300})).save();
        (new ThisPersistentModel({ _id : '618d53514e0720e69e2e54c9' , title : "La traviata" , date : "2022-02-20" , startTime : "18:30" , unitPrice : 30 , description : "Opera de Verdi" , maxNbPlaces : 300})).save();
        resolve({action:"session database re-initialized"})
      })
  });
}

function findById(id) {
  return genericPromiseMongoose.findByIdWithModel(id,ThisPersistentModel);
}

//exemple of criteria : {} or { unitPrice: { $gte: 25 } } or ...
function findByCriteria(criteria) {
  return genericPromiseMongoose.findByCriteriaWithModel(criteria,ThisPersistentModel);
}

function save(entity) {
  return genericPromiseMongoose.saveWithModel(entity,ThisPersistentModel);
}

function updateOne(newValueOfEntityToUpdate) {
  return genericPromiseMongoose.updateOneWithModel(newValueOfEntityToUpdate,newValueOfEntityToUpdate.id,ThisPersistentModel);
}

function deleteOne(idOfEntityToDelete) {
  return genericPromiseMongoose.deleteOneWithModel(idOfEntityToDelete,ThisPersistentModel);
}

module.exports.ThisPersistentModel=ThisPersistentModel;
module.exports.reinit_db = reinit_db;
module.exports.findById = findById ;
module.exports.findByCriteria = findByCriteria ;
module.exports.save = save ;
module.exports.updateOne = updateOne ;
module.exports.deleteOne = deleteOne ;

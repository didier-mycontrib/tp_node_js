var mongoose = require('mongoose');
var reservationDbMongoose = require('./reservation-db-mongoose');
var genericPromiseMongoose = require('./generic-promise-mongoose');//generic helper for entity model with  .id , ._id

var thisDb = reservationDbMongoose.thisDb;

//NB: This is for current entity type ("Devise" or "Customer" or "Product" or ...)
//NB: thisSechema end ThisPersistentModel should not be exported (private only in this current module)
var thisSchema;//mongoose Shcema (structure of mongo document)
var ThisPersistentModel; //mongoose Model (constructor of persistent ThisPersistentModel)

function initMongooseWithSchemaAndModel () {
   
    mongoose.Connection = thisDb;
      thisSchema = new mongoose.Schema({
        /* default mongo _id: { type : String , alias : "id" } ,*/
        firstName: String,
        lastName : String,
        username : String ,
        email : String,
        mobilePhoneNumber : String ,
        address : String
      });
      thisSchema.set('id',true); //default virtual id alias as string for _id
      thisSchema.set('toJSON', { virtuals: true , 
                                   versionKey:false,
                                   transform: function (doc, ret) {   delete ret._id; delete ret._v;  }
                                 });                          
      //console.log("mongoose thisSchema : " + JSON.stringify(thisSchema) );
      //"CustomerInfo" model name is "customerInfos" collection name in mongoDB reservation_db database
      ThisPersistentModel = mongoose.model('CustomerInfo', thisSchema);
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
        (new ThisPersistentModel({ _id: "618d54d5386fcff631470c76"  ,firstName : "alex" , lastName : "Therieur" , username : "alexTherieur"  ,  email : "alex.therieur@ici.fr" , mobilePhoneNumber : "0606060606" , address : "2 rue elle 27000 Evreux France"})).save();
        (new ThisPersistentModel({ _id: "618d54d5386fcff631470c78" , firstName : "jean" , lastName : "Bon" ,  username : "jeanBon" ,   email : "jean.bon@labas.fr" , mobilePhoneNumber : "0601020304", address : "23 rue abc 75000 Paris France"})).save();
        resolve({action:"customerInfos collection re-initialized"})
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

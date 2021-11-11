var mongoose = require('mongoose');
var customerDbMongoosee = require('./customer-db-mongoose');
var genericPromiseMongoose = require('./generic-promise-mongoose');//generic helper for entity model with  .id , ._id

var thisDb = customerDbMongoosee.thisDb;

//NB: This is for current entity type ("Devise" or "Customer" or "Product" or ...)
//NB: thisSechema end ThisPersistentModel should not be exported (private only in this current module)
var thisSchema;//mongoose Shcema (structure of mongo document)
var ThisPersistentModel; //mongoose Model (constructor of persistent ThisPersistentModel)


function initMongooseWithSchemaAndModel () {
 
    mongoose.connection = thisDb;

      //username (as id/pk) of type String should be unique (ex: value of customer email or ...)
      //username should reference a valid customer in the Customer collection (via a previous query to launch to check)

      thisSchema = new mongoose.Schema({
        /* default mongo _id: { type : String , alias : "id" } ,*/
        _id: { type : String , alias : "username" } ,
        password: String
      });
      thisSchema.set('id',false); //no default virtual id alias as string for _id
      thisSchema.set('toJSON', { virtuals: true , 
                                   versionKey:false,
                                   transform: function (doc, ret) {   delete ret._id; delete ret._v;  }
                                 });
                           
      //console.log("mongoose thisSchema : " + JSON.stringify(thisSchema) );
      //"Account" model name is "accounts" collection name in mongoDB customer_db database
      ThisPersistentModel = mongoose.model('Account', thisSchema);
      
      //console.log("mongoose PersistentAccountModel : " + ThisPersistentModel );
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
        (new ThisPersistentModel({ username : "alexTherieur" , password : "pwd1"  })).save();
        (new ThisPersistentModel({ username : "jeanBon" , password : "pwd2"  })).save();
        resolve({action:"account collection re-initialized"})
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
  return genericPromiseMongoose.updateOneWithModel(newValueOfEntityToUpdate,newValueOfEntityToUpdate.username,ThisPersistentModel);
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

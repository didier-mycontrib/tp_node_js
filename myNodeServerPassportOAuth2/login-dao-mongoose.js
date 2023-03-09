import mongoose from 'mongoose';
import dbMongoose from './db-mongoose.js';
import genericPromiseMongoose from './generic-promise-mongoose.js';//generic helper for entity model with  .id , ._id

var thisDb = dbMongoose.thisDb;

//NB: This is for current entity type ("Devise" or "Customer" or "Product" or ...)
//NB: thisSchema end ThisPersistentModel should not be exported (private only in this current module)
var thisSchema;//mongoose Shcema (structure of mongo document)
var ThisPersistentModel; //mongoose Model (constructor of persistent ThisPersistentModel)

function initMongooseWithSchemaAndModel () {

    //default auto generated objectId of mongoDB is better than number auto_incr
    //because it is more unique (no problem with objectId, but risk of same id  if auto_incr is reset)
   
    mongoose.Connection = thisDb;
      thisSchema = new mongoose.Schema({
        _id: { type : String , alias : "username" } ,
        password: String  ,
        roles : String
      });
     
      //NB: la partie "password" devrait idéalement jamais être stockée telle quelle
      // mais cryptée via bcrypt

      thisSchema.set('id',false); //no default virtual id alias for _id
      thisSchema.set('toJSON', { virtuals: true , 
                                   versionKey:false,
                                   transform: function (doc, ret) {   delete ret._id;  }
                                 });                             
      //console.log("mongoose thisSchema : " + JSON.stringify(thisSchema) );
      //"Login" model name is "logins" collection name in mongoDB  database
      ThisPersistentModel = mongoose.model('Login', thisSchema);
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
        (new ThisPersistentModel({ username : "user1" , password : "pwduser1" , roles : "user"})).save();
        (new ThisPersistentModel({ username : "user2" , password : "pwduser2" , roles : "user"})).save();
        (new ThisPersistentModel({ username : "admin1" , password : "pwdadmin1" , roles : "admin,user"})).save();
        (new ThisPersistentModel({ username : "admin2" , password : "pwdadmin2" , roles : "admin"})).save();
        resolve({action:"logins collection re-initialized in mongoDB database"})
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


export default { ThisPersistentModel ,  reinit_db ,
   findById , findByCriteria , save , updateOne ,  deleteOne};

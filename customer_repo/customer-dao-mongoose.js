var mongoose = require('mongoose');
var customerDbMongoosee = require('./customer-db-mongoose');
var genericPromiseMongoose = require('./generic-promise-mongoose');//generic helper for entity model with  .id , ._id

var thisDb = customerDbMongoosee.thisDb;

//NB: This is for current entity type ("Devise" or "Customer" or "Product" or ...)
//NB: thisSechema end ThisPersistentModel should not be exported (private only in this current module)
var thisSchema;//mongoose Shcema (structure of mongo document)
var ThisPersistentModel; //mongoose Model (constructor of persistent ThisPersistentModel)

function initMongooseWithSchemaAndModel () {
   
  mongoose.Connection = thisDb;

      addressSchema = new  mongoose.Schema({
        num: String,
        street : String,
        zipCode : String,
        town : String,
        country : String 
      });
      addressSchema.set('id',false); //no default virtual id alias as string for _id
      addressSchema.set('toJSON', { virtuals: true , 
                                   versionKey:false,
                                   transform: function (doc, ret) {   delete ret._id;   }
                                 });

      thisSchema = new mongoose.Schema({
        /* default mongo _id: { type : String , alias : "id" } ,*/
        firstName: String,
        lastName : String,
        username : { type: String , unique : true },
        birthDay : String,
        email : String,
        mobilePhoneNumber : String ,
        address : addressSchema
      });
      thisSchema.set('id',true); //default virtual id alias as string for _id
      thisSchema.set('toJSON', { virtuals: true , 
                                   versionKey:false,
                                   transform: function (doc, ret) {   delete ret._id; delete ret._v;  }
                                 });                               
      //console.log("mongoose thisSchema : " + JSON.stringify(thisSchema) );
      //"Customer" model name is "customers" collection name in mongoDB customer_db database
      ThisPersistentModel = mongoose.model('Customer', thisSchema);
      
      //console.log("mongoose PersistentcustomerModel : " + ThisPersistentModel );
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
        (new ThisPersistentModel({ _id: "618d54d5386fcff631470c76" , firstName : "alex" , lastName : "Therieur" , username : "alexTherieur" , birthDay : "1973/12/21" ,  email : "alex.therieur@ici.fr" , mobilePhoneNumber : "0606060606" , address : { num: "2" , street : "rue elle", zipCode : "27000" , town : "Evreux" , country : "France"}})).save();
        (new ThisPersistentModel({ _id: "618d54d5386fcff631470c78" , firstName : "jean" , lastName : "Bon" ,  username : "jeanBon" , birthDay : "1977/02/11" ,  email : "jean.bon@labas.fr" , mobilePhoneNumber : "0601020304", address : { num: "23" , street : "rue abc", zipCode : "75000" , town : "Paris" , country : "France"}})).save();
        resolve({action:"customer collection re-initialized"})
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

var sequelize = require('./db-config.js');
var Sequelize = require("sequelize");//Sequelize.STRING,Sequelize.INTEGER, ....

/* (###)
        tableName: 'xyz', timestamps: false, underscored=true
		si timestamps : true (par defaut) alors
CREATE TABLE IF NOT EXISTS "Xxx" (
  "id" SERIAL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  ...)	
*/

class Customer extends Sequelize.Model {};
Customer.init({
    /*id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},*/
	lastName: { type: Sequelize.STRING(64),allowNull: false 	},
	firstName: { type: Sequelize.STRING(64),allowNull: false  	},
	phoneNumber: { type: Sequelize.STRING(16),allowNull: false 	},
	email: { type: Sequelize.STRING(64),allowNull: true 	}
}, { sequelize, modelName: 'customer' ,  freezeTableName: true }); 

//default table name = "customers" (with s suffix) without freezeTableName: true
//default table name = "customer" (without s suffix) if modelName='customer' with freezeTableName: true

//NB: var Xxx = sequelize.define( { attrDefs} , { tableName= 'Xxx' , ... });
//ou bien class Xxx extends Sequelize.Model {}; et Xxx.init({attrDefs } , { sequelize, modelName: 'xxx' });
//sequelize.define() call .init() internaly

//NB: default sequelize primary key for any table :
//id: {type: Sequelize.INTEGER or ... , autoIncrement: true, primaryKey: true},

//CREATE TABLE IF NOT EXISTS `Adresse`
//--> IF TABLE Already exists with different structure ==> BUG , TABLE or DATABASE muest be re-created

var AddressOfCustomer = sequelize.define('addressOfCustomer', {
	idAddr: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
	numberAndStreet: { type: Sequelize.STRING(64),allowNull: false 	},
	zip: { type: Sequelize.STRING(64),allowNull: false  	},
	town: { type: Sequelize.STRING(64),allowNull: false 	}
    }, { 
	tableName: 'address_of_customer', timestamps: false , underscored : true			
	});
//NB: if underscored : true , columnName = snake_case instead of camelCase
//ex: id_addr , number_and_street
	
//NB: default foreign key is "XxxxId" or "XxxPkName" 	
Customer.hasOne(AddressOfCustomer ,  {foreignKey: 'refCustomer'}); // Will add refCustomer fk to Adresse
//ou bien AddressOfCustomer.belongsTo(Customer  , {foreignKey: 'refCustomer'}); // Will add refCustomer fk to Adresse ?

class Account extends Sequelize.Model {};
Account.init({
    number: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
	label: { type: Sequelize.STRING(64),allowNull: false 	},
	/*solde*/balance: { type: Sequelize.DOUBLE ,allowNull: false  , validate : { min: -1500 }	} 
}, { sequelize, modelName: 'account' ,  freezeTableName: true });

class Operation extends Sequelize.Model {};
Operation.init({
    number: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
	label: { type: Sequelize.STRING(64),allowNull: false 	},
	amount: { type: Sequelize.DOUBLE ,allowNull: false  	},
	dateOp: { type: Sequelize.DATEONLY ,allowNull: false  	}
}, { sequelize, modelName: 'operation' ,  freezeTableName: true }); 
	
Operation.belongsTo(Account);//une operation est un detail d'un seul compte
                             //un compte peut comporter plusieurs opérations
                             //many operations to One Account	
                             //default fk in Operation : AccountNumber = Account + PkNameInAccount							 
Account.hasMany(Operation);	//relation inverse (OneToMany) pour autoriser parcours/requetes inverses
//Account.hasMany(Operation , { as : "lastOperations" } );
	
//as ="roleName" correspond à une vision orientée objet de l'association (role UML)
//et correspondra à un attribut de l'objet javascript permettant de naviguer d'un niveau à l'autre
//NB: la valeur par défaut est le modelName référencé
//la valeur de as est considérée par sequelize comme un "alias" qu'il faut régulièrement préciser
//exemple MyModel.Account.findAll( { include: [{model: MyModel.Operation , as: "lastOperations" }] })
//==> pour faire simple modelName commençant par une minuscule et pas trop de "as:"	
	
var exports = module.exports = {};
exports.sequelize = sequelize;	
exports.AddressOfCustomer = AddressOfCustomer;
exports.Customer = Customer;
exports.Account = Account;
exports.Operation = Operation;
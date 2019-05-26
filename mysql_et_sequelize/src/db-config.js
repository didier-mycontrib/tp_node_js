var Sequelize = require('sequelize');
	
			// db config
			var env="dev" ; //or "prod"
			var confDb = require('./database.cfg.json')[env];
			var password = confDb.password ? confDb.password : null;
	
			// initialize database connection
			var sequelize = new Sequelize(
				confDb.database,
				confDb.user,
				confDb.password, {
					dialect: confDb.dialect,
					port : confDb.port,
					logging: false, // false or console.log,// permet de voir les logs de sequelize
					define: {
						timestamps: false
					}
				}
			);
	
			sequelize
				.authenticate()
				.then(function(cn) {
					console.log('Connection has been established successfully.');
				}, function(err) {
					console.log('Unable to connect to the database:', err);
				});
	
			module.exports = sequelize;
			
/*
var Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');

var sequelize = new Sequelize('database', 'username', 'password', {
host: 'localhost',
dialect: 'mysql',
logging: false,//passer a true pour voir les différentes requêtes effectuées par l'ORM
});
//on exporte pour utiliser notre connexion depuis les autre fichiers.
var exports = module.exports = {};
exports.sequelize = sequelize;
*/			
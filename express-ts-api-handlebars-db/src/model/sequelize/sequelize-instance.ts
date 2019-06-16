
import {Sequelize } from 'sequelize';
	
import {IDbConfig , confDb } from '../../config/db-config';

	
// initialize database connection
export const  sequelize = new Sequelize(
				confDb.database,
				confDb.user,
				confDb.password , { 
					dialect: confDb.dialect,
					port : confDb.port,
					logging: false, // false or console.log,// permet de voir les logs de sequelize
					define: {
						timestamps: false
					}
				}
			);
	
sequelize.authenticate()
	.then((cn) => {
		console.log('Connection has been established successfully.');
	}, (err)=> {
		console.log('Unable to connect to the database:', err);
	});
	
			
				

			
			